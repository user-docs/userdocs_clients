console.log('Injected page script')

window.addEventListener('message', function (message) {
  if (message.data.from == "UserDocs") window.sendEvent(message.data) 
})