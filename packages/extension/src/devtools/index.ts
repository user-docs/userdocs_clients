import { actions } from "../actions";

export function sendCurrentSelector() {
  chrome.devtools.inspectedWindow.eval(`parseElementMessage($0)`, { useContentScriptContext: true }, 
    (result, isException) => {
      if(isException) console.log(isException) 
      else { 
        result["action"] = "ITEM_SELECTED"
        backgroundPageConnection.postMessage(result) 
      }
    }
  )
}

var backgroundPageConnection = chrome.runtime.connect({ name: "devtools" }); 
backgroundPageConnection.onMessage.addListener(function (message) {
  if (message.action) {
    if (message.action == actions.click) {
      const script = `inspect($('${message.selector}'))`
      chrome.devtools.inspectedWindow.eval(script, (result, isException) => {
        if (isException) console.log(isException)
      })
    }
  }
});

chrome.devtools.panels.elements.createSidebarPane("UserDocs",
  function(sidebar) {
    sidebar.setPage('./dist/panel.html');
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(sendCurrentSelector)

sendCurrentSelector()
