import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default pluginManager => {
  const { baseLinearDisplayConfigSchema } = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports
  return ConfigurationSchema(
    'LinearIEQDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}
