import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { Instance } from 'mobx-state-tree'
import PluginManager from '@jbrowse/core/PluginManager'
import { createInternetAccountConfig } from '@jbrowse/core/pluggableElementTypes/models'

function GDCConfigFactory(pluginManager: PluginManager) {
  return ConfigurationSchema(
    'GDCInternetAccount',
    {
      validDomains: {
        description:
          'array of valid domains the url can contain to use this account. Empty = all domains',
        type: 'stringArray',
        defaultValue: [],
      },
      authHeader: {
        description: 'custom auth header for authorization',
        type: 'string',
        defaultValue: 'Authorization',
      },
      customEndpoint: {
        description: 'custom endpoint for the external token resource',
        type: 'string',
        defaultValue: '',
      },
    },
    {
      baseConfiguration: createInternetAccountConfig(pluginManager),
      explicitlyTyped: true,
    },
  )
}

export type GDCInternetAccountConfigModel = ReturnType<typeof GDCConfigFactory>
export type OAuthInternetAccountConfig = Instance<GDCInternetAccountConfigModel>
export default GDCConfigFactory
