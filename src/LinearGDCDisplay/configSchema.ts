import PluginManager from '@jbrowse/core/PluginManager'
import {
  ConfigurationSchema,
  AnyConfigurationSchemaType,
} from '@jbrowse/core/configuration'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

export default (pluginManager: PluginManager): AnyConfigurationSchemaType => {
  const { baseLinearDisplayConfigSchema } = (
    pluginManager.getPlugin('LinearGenomeViewPlugin') as LinearGenomeViewPlugin
  ).exports
  return ConfigurationSchema(
    'LinearGDCDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}
