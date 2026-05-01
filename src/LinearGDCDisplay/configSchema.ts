import type PluginManager from '@jbrowse/core/PluginManager'
import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import type LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

const linearGDCDisplayConfigSchema = (
  pluginManager: PluginManager,
): AnyConfigurationSchemaType => {
  const { baseLinearDisplayConfigSchema } = (
    pluginManager.getPlugin('LinearGenomeViewPlugin') as LinearGenomeViewPlugin
  ).exports
  return ConfigurationSchema(
    'LinearGDCDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}

export default linearGDCDisplayConfigSchema
