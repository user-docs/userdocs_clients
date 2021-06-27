export function browserClosed(payload) {
  const element = document.querySelector('#automated-browser-controls');
  const event = new CustomEvent("browser-closed", {
      bubbles: false,
      detail: payload
  })
  element.dispatchEvent(event)
}

export function browserEventHandler(payload) {
  console.log("Browser Event Occured in electron")
  const element = document.getElementById('browser-event-handler');
  const event = new CustomEvent("browser-event", {
    bubbles: false, detail: payload
  })
  element.dispatchEvent(event)
}

export function browserOpened(payload) {
  console.log("Browser Opened")
  const element = document.querySelector('#automated-browser-controls');
  const event = new CustomEvent("browser-opened", {
      bubbles: false,
      detail: payload.detail
  })
  element.dispatchEvent(event)
}

export function stepUpdated(step) {
  try {
    console.log("trying to update automation manager")
    document
      .getElementById("automation-manager-hook")
      .dispatchEvent(new CustomEvent("update-step", {
        bubbles: false,
        detail: step
      }))
  } catch (e) {
    console.error(`Failed to send update to step-instance: ${step.id } because ${e}`)
  }
}

export function processUpdated(process) {
  console.log("Updating process " + process.id  + " status")
  try {
    document  
      .getElementById("automation-manager-hook")
      .dispatchEvent(new CustomEvent("update-process", {
        bubbles: false,
        detail: process 
      }))
  } catch (e) {
    console.log("Failed to send update to process-" + process.id + "-runner")
  }
}