import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'SjqAdapter',
  {
    sjqLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/myfile.tsv', locationType: 'UriLocation' },
    },
  },
  { explicitlyTyped: true },
)
