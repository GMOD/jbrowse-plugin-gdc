import { ConfigurationSchema } from '@jbrowse/core/configuration'

const linearMAFDisplayConfigSchema = pluginManager => {
  const { baseLinearDisplayConfigSchema } = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports
  return ConfigurationSchema(
    'LinearMAFDisplay',
    { renderer: pluginManager.pluggableConfigSchemaType('renderer') },
    { baseConfiguration: baseLinearDisplayConfigSchema, explicitlyTyped: true },
  )
}

export default linearMAFDisplayConfigSchema
