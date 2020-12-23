(function(){"use strict"})()

import * as express from "express"
import * as rLimit from "express-rate-limit"
import * as storage from "node-persist"
import * as path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))

import { counter } from "./counter.mjs"

export const routes = express.default.Router()

const limiter = rLimit.default({
  windowMs: 1 * 1000, // 5 seconds
  max: 1
})

routes.get("/",
	(req, res) => {
		res.setHeader("Content-Type", "text/html")
    res.setHeader("X-Content-Type-Options", "nosniff")
    var options = {
    	headers: {
    		"counter": counter.number
    	}
    }
    res.sendFile(path.join(__dirname, "views/index.html"), options)
	})

routes.post("/agree", limiter,
	(req, res) => {
		counter.number++
		storage.default.setItem("counter", counter.number).then(() => {
			let payload = { counter: counter.number }
			res.status(200).send(JSON.stringify(payload))
		})
	})

routes.post("/check",
	(req, res) => {
		let payload = { counter: counter.number }
		res.status(200).send(JSON.stringify(payload))
	})