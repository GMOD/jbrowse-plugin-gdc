import type PluginManager from '@jbrowse/core/PluginManager'
import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import type { IAnyModelType } from '@jbrowse/mobx-state-tree'
import configSchemaF from './configSchema'
import modelF from './model'

const linearGDCDisplayPlugin = (
  pluginManager: PluginManager,
): { configSchema: AnyConfigurationSchemaType; stateModel: IAnyModelType } => {
  const schema = configSchemaF(pluginManager)
  return {
    configSchema: schema,
    stateModel: modelF(pluginManager, schema),
  }
}

export default linearGDCDisplayPlugin
