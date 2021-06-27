import { actions } from '../actions'

document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get([ 'authoring' ], (result) => {
    var btn: any = document.getElementById('authoring-toggle'); // Bogus, should be HTMLInputElement
    btn.checked = result.authoring
    btn.addEventListener('change', function(event) {
      let target: any = event.target
      if (target.checked === true) chrome.runtime.sendMessage({ action: actions.START })
      else chrome.runtime.sendMessage({ action: actions.STOP })
    });
  })
});
