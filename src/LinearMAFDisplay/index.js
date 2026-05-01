import configSchemaF from './configSchema'
import modelF from './model'

const linearMAFDisplayPlugin = pluginManager => {
  return {
    configSchema: pluginManager.jbrequire(configSchemaF),
    stateModel: pluginManager.jbrequire(modelF),
  }
}

export default linearMAFDisplayPlugin
