chrome.devtools.panels.elements.createSidebarPane("UserDocs",
  function(sidebar) {
    sidebar.setPage('./dist/panel.html');
});

export function sendCurrentSelector() {
  console.log("Sending current selector")
  chrome.devtools.inspectedWindow.eval(`testContent($0)`, 
    { useContentScriptContext: true }, (result, isException) => {
      if(!isException) {
        chrome.runtime.sendMessage({ action: 'itemSelected', selector: result });
      } else {
        console.log(isException)
      }
    }
  )
}

function elementSelectionChanged() {
  console.log("selection changed")
  sendCurrentSelector()
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(elementSelectionChanged)

console.log("firing up")
sendCurrentSelector()

const script = `
  var result  
  console.log('test start'); 
  console.log(testContent); 
  try {
    result = 
  } catch(e) { console.log(e)}
  console.log(result)
  result
`