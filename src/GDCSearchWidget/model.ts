import { ElementId } from '@jbrowse/core/util/types/mst'
import PluginManager from '@jbrowse/core/PluginManager'
import { FileLocation } from '@jbrowse/core/util/types'

import { types, Instance } from 'mobx-state-tree'

export default function f(pluginManager: PluginManager) {
  return types
    .model('GDCSearchWidget', {
      id: ElementId,
      type: types.literal('GDCSearchWidget'),
    })
    .volatile(() => ({
      trackData: undefined as FileLocation | undefined,
      indexTrackData: undefined as FileLocation | undefined,
    }))
    .actions(self => ({
      setTrackData(obj: FileLocation) {
        self.trackData = obj
      },
      setIndexTrackData(obj: FileLocation) {
        self.indexTrackData = obj
      },

      clearData() {
        self.indexTrackData = undefined
        self.trackData = undefined
      },
    }))
}

export type ImportPanelStateModel = ReturnType<typeof f>
export type ImportPanelModel = Instance<ImportPanelStateModel>
