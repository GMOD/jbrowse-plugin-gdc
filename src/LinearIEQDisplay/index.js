import configSchemaF from './configSchema'
import modelF from './model'

export default pluginManager => {
  return {
    configSchema: pluginManager.jbrequire(configSchemaF),
    stateModel: pluginManager.jbrequire(modelF),
  }
}
