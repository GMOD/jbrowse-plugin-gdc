import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { ElementId } from '@jbrowse/core/util/types/mst'
import GDCFeatureWidgetF from './GDCFeatureWidget'

export default jbrowse => {
  const { types } = jbrowse.jbrequire('mobx-state-tree')
  const configSchema = ConfigurationSchema('GDCFeatureWidget', {})
  const stateModel = types
    .model('GDCFeatureWidget', {
      id: ElementId,
      type: types.literal('GDCFeatureWidget'),
      featureData: types.frozen({}),
    })
    .actions(self => ({
      setFeatureData(data) {
        self.featureData = data
      },
      clearFeatureData() {
        self.featureData = {}
      },
    }))

  const ReactComponent = jbrowse.jbrequire(GDCFeatureWidgetF)

  return { configSchema, stateModel, ReactComponent }
}
