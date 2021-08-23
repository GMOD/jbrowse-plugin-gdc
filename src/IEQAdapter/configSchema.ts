import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'IeqAdapter',
  {
    ieqLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/myfile.tsv', locationType: 'UriLocation' },
    },
  },
  { explicitlyTyped: true },
)
