export interface Configuration {
  browser: object, 
  automationFramework: any,
  imagePath: string,
  maxRetries: number,
  stepInstance: {
    preExecutionCallbacks: Array<string | Function>
  }
}