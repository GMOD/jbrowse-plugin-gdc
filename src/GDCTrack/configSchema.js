import { ConfigurationSchema } from '@gmod/jbrowse-core/configuration'

export default pluginManager => {
    const { BaseTrackConfig: LinearGenomeTrackConfig }  = pluginManager.getPlugin('LinearGenomeViewPlugin').exports
    return ConfigurationSchema(
    'GDCTrack',
    {
      adapter: pluginManager.pluggableConfigSchemaType('adapter'),
      renderer: pluginManager.pluggableConfigSchemaType('renderer'),
    },
    { baseConfiguration: LinearGenomeTrackConfig, explicitlyTyped: true },
  )
}
