import PluginManager from '@jbrowse/core/PluginManager'
import { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import { IAnyModelType } from '@jbrowse/mobx-state-tree'
import configSchemaF from './configSchema'
import modelF from './model'

export default (
  pluginManager: PluginManager,
): { configSchema: AnyConfigurationSchemaType; stateModel: IAnyModelType } => {
  const schema = configSchemaF(pluginManager)
  return {
    configSchema: schema,
    stateModel: modelF(pluginManager, schema),
  }
}
