import { ElementId } from '@jbrowse/core/util/types/mst'
import type PluginManager from '@jbrowse/core/PluginManager'
import type { FileLocation } from '@jbrowse/core/util/types'

import type { Instance } from '@jbrowse/mobx-state-tree'
import { types } from '@jbrowse/mobx-state-tree'

export default function f(_pluginManager: PluginManager) {
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
      setTrackData(obj?: FileLocation) {
        self.trackData = obj
      },
      setIndexTrackData(obj?: FileLocation) {
        self.indexTrackData = obj
      },

      clearData() {
        self.indexTrackData = undefined
        self.trackData = undefined
      },
    }))
}

export type GDCSearchStateModel = ReturnType<typeof f>
export type GDCSearchModel = Instance<GDCSearchStateModel>
