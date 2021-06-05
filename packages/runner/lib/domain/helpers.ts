export function fetchCallbacks(callbacks: Array<string | Function>, functions: { [key: string]: Function }) {
  var callbackFunctions = []
  if (callbacks) {
    for(const callback of callbacks) {
      if (typeof callback == 'function') callbackFunctions.push(callback)
      else if (typeof callback == 'string') {
        const callbackFunction = functions[callback]
        if(!callbackFunction) throw new Error(`fetchCallbacks retreived an invalid function named ${callback}`)
        callbackFunctions.push(callbackFunction)
      }
      else throw new Error("Passed an invalid callback argument.  Adjust your parameters and retry.")
    }
  }
  return callbackFunctions
}

export function validateCallbacks(callbacks: Array<Function>) {
  var callbackFunctions = []
  for(const callback of callbacks) {
    if (typeof callback == 'function') callbackFunctions.push(callback)
    else throw new Error("Passed an invalid callback function.  This only accepts functions.")
  }
  return callbackFunctions
}