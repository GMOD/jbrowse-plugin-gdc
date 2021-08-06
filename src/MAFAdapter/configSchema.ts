import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'MafAdapter',
  {
    mafLocation: {
      type: 'fileLocation',
      defaultValue: { uri: '/path/to/myfile.maf' },
    },
  },
  { explicitlyTyped: true },
)
