import { ConfigurationSchema } from '@jbrowse/core/configuration'

const linearIEQDisplayConfigSchema = pluginManager => {
  const { baseLinearDisplayConfigSchema } = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports
  return ConfigurationSchema(
    'LinearIEQDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}

export default linearIEQDisplayConfigSchema
