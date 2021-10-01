import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { Instance } from 'mobx-state-tree'
import { BaseInternetAccountConfig } from '@jbrowse/core/pluggableElementTypes/models'

const GDCConfigSchema = ConfigurationSchema(
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
    baseConfiguration: BaseInternetAccountConfig,
    explicitlyTyped: true,
  },
)

export type GDCInternetAccountConfigModel = typeof GDCConfigSchema
export type OAuthInternetAccountConfig = Instance<GDCInternetAccountConfigModel>
export default GDCConfigSchema
