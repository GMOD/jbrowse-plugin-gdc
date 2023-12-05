import configSchemaF from './configSchema'
import modelF from './model'

export default pluginManager => {
  return {
    configSchema: configSchemaF(pluginManager),
    stateModel: modelF(pluginManager),
  }
}
