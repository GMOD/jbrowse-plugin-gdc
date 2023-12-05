import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import { ElementId } from '@jbrowse/core/util/types/mst'
import { types } from 'mobx-state-tree'

export const configSchema = ConfigurationSchema('GDCFeatureWidget', {})

export function stateModelFactory(_pluginManager: PluginManager) {
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

  return stateModel
}
