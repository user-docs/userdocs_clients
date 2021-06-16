import 'alpinejs'

document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('start-authoring');
  btn.addEventListener('click', function() {
    console.log('Popup got event, sending to ?content script?')
    chrome.runtime.sendMessage('startAuthoring', (response) => {
      console.log(response)
    })
  });
});
