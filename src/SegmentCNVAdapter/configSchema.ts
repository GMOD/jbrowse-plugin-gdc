import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'SegmentCNVAdapter',
  {
    segLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/myfile.seg', locationType: 'UriLocation' },
    },
  },
  { explicitlyTyped: true },
)
