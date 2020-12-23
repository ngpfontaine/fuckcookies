(function(){"use strict"})()

import * as dotenv from "dotenv"
import * as express from "express"
import * as storage from "node-persist"
import * as morgan from "morgan"
import * as path from "path"
import { dirname } from "path"
import { fileURLToPath } from "url"
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.default.config()

import { routes } from "./routes.mjs"
import { counter } from "./counter.mjs"

const app = express.default()
const port = process.env.PORT

if (process.env.NODE_ENV === "development") {
	app.use(morgan.default("dev"))
}

app.use(routes)
app.use(express.default.static(path.join(__dirname, "public")))

storage.default.init()
	.then(() => {
		storage.default.getItem("counter")
			.then((value) => {
				counter.number = value > 0 ? value : counter.number

				app.listen(port, (err) => {
				  if (err) { return console.log("express error: " + err) }
				  console.log("Node: server port " + port)
				})

			})
		})