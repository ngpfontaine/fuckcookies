// Immutable domDialog references
const domDialog = {
  body: document.getElementsByTagName('body'),
  dialog: {
    modal: document.getElementsByClassName('dialog'),
    btnOpen: document.getElementsByClassName('dialog-btn-open'),
    btnClose: document.getElementsByClassName('dialog-btn-close')
  },
  eventClasses: ["dialog-btn-open", "dialog-btn-close", "dialog-outer", "dialog-inner"]
}

// Store mutable dialog values, & toggle function
var dialog = {
  openIndex: undefined,
  escListener: undefined,
  transTime: 150, // dialog transition time will need to be used as a delay to remove .dialog-active from <body>

  // Toggle modal per index, change focus between open/close buttons
  ModalToggle: (e, index, modal) => {
    
    // Dialog is closed. Open
    if (!modal.classList.contains("active")) {

      domDialog.body[0].classList.add('dialog-active')
      // Reset to top on open
      modal.scrollTop = 0
      dialog.openIndex = index
      // Show
      modal.classList.add('active')

      // Add ESC listener, that removes itself
      // document.addEventListener('click', dialog.escListener = function(e) {
      //   (function(i, btnOpen) {
      //     if (e.keyCode === 27) { // Esc key
      //       document.removeEventListener('click', dialog.escListener)
      //       setTimeout(function() {
      //         domDialog.body[0].classList.remove('dialog-active')
      //       },150)
      //       modal.classList.remove('active')
      //       btnOpen.focus()
      //     }
      //   })(index, open)
      // })
      
    }
    // Dialog is Open. Close
    else {
      setTimeout(function() {
        domDialog.body[0].classList.remove('dialog-active')
      },150)
      // Remove 'esc to close' listener from document
      document.removeEventListener('click', dialog.escListener)
      dialog.escListener = undefined
      dialog.openIndex = undefined
      modal.classList.remove('active')
    }
    
  }

}

// Add Dialog events
if (domDialog.dialog.modal.length > 0) {

  // Loop open buttons, add open events
  Array.from(domDialog.dialog.btnOpen).forEach((open, i) => {
    if (open.hasAttribute("data-dialog-id")) {
      let id = Number(open.getAttribute("data-dialog-id"))
      let modal = document.getElementById("dialog-" + id)
      if (modal === undefined || modal === null) {
        console.log("Dialog not found for open button: " + id)
      }
      // Open event
      ((open) => {
        open.addEventListener("click", function(e) {
          dialog.ModalToggle(e, id, modal)
        })
      })(open)
    }
  })

  // Loop close buttons, add close events
  Array.from(domDialog.dialog.btnClose).forEach((close, i) => {
    if (close.hasAttribute("data-dialog-id")) {
      let id = Number(close.getAttribute("data-dialog-id"))
      let modal = document.getElementById("dialog-" + id)
      if (modal === undefined || modal === null) {
        console.log("Dialog not found for close button: " + id)
      }
      ((close) => {
        close.addEventListener("click", function(e) {
          dialog.ModalToggle(e, id, modal)
        })
      })(close)
    }
  })

  // Loop dialogs, add outer close event
  Array.from(domDialog.dialog.modal).forEach((modal, i) => {

    var id = modal.getAttribute("id").split("dialog-")[1]

    var outer = modal.getElementsByClassName('dialog-outer')[0]
    var inner = modal.getElementsByClassName('dialog-inner')[0]

    // Outer close event
    if (outer !== undefined && outer !== null) {
      outer.addEventListener('mousedown', function(e) {
        dialog.ModalToggle(e, id, modal)
      })
      // Inner - Disable toggle on children of outer
      if (inner !== undefined && inner !== null) {
        inner.addEventListener('mousedown', function(e) {
          e.stopPropagation()
        })
      }
    }
    else {
      console.log('bonkr dialog warning - no .dialog-outer exists. This is used to cover the page content & make closing easier')
    }

  })
}