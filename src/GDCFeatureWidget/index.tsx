import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { types } from 'mobx-state-tree'
import ReactComponent from './GDCFeatureWidget'

export default (_: PluginManager) => {
  const configSchema = ConfigurationSchema('GDCFeatureWidget', {})
  const stateModel = types
    .model('GDCFeatureWidget', {
      id: ElementId,
      type: types.literal('GDCFeatureWidget'),
      featureData: types.frozen({}),
    })
    .actions(self => ({
      setFeatureData(data: any) {
        self.featureData = data
      },
      clearFeatureData() {
        self.featureData = {}
      },
    }))

  return { configSchema, stateModel, ReactComponent }
}
