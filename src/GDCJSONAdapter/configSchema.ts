import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'

export default ConfigurationSchema(
  'GDCJSONAdapter',
  {
    featureType: {
      type: 'stringEnum',
      model: types.enumeration('Feature Type', ['mutation', 'gene']),
      defaultValue: 'mutation',
      description: 'The type of the track to add',
    },
    data: {
      type: 'string',
      defaultValue: '',
      description: 'JSON string of the GDC data from the file'
    }
  },
  { explicitlyTyped: true },
)
