import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'MbvAdapter',
  {
    mbvLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/myfile.txt', locationType: 'UriLocation' },
    },
  },
  { explicitlyTyped: true },
)
