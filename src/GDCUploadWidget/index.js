import { ConfigurationSchema, readConfObject } from '@jbrowse/core/configuration'
import { getSession } from '@jbrowse/core/util'
import { ElementId } from '@jbrowse/core/util/types/mst'

import GDCUploadWidgetF from './GDCUploadWidget'

export default jbrowse => {
  const { types } = jbrowse.jbrequire('mobx-state-tree')
  const configSchema = ConfigurationSchema('GDCUploadWidget', {})
  const stateModel = types
    .model('GDCUploadWidget', {
        id: ElementId,
        type: types.literal('GDCUploadWidget'),
    })

    .actions(self => ({
      addTrack() {
        const session = getSession(self)
        const gdc_track = session.tracks.find(track => {
          return track.trackId === 'gdc_plugin_track'
        })

        const trackSnapshot = JSON.parse(
          JSON.stringify(getSnapshot(gdc_track)),
        )
        const now = Date.now()
        trackSnapshot.trackId += `-${now}`
        trackSnapshot.displays.forEach(
          (display) => {
            display.displayId += `-${now}`
          },
        )
        trackSnapshot.name += ' (copy)'
        trackSnapshot.category = undefined
        trackSnapshot.adapter
        session.addTrackConf(trackSnapshot)

        const gdcFilters = {
          op: "and",
          content: [
            {
              op: "in",
              content: {
                field: "cases.project.project_id",
                value: [
                  "TCGA-UCEC"
                ]
              }
            }
          ]
        }

        const newTrack = session.tracks.find(track => {
          return track.trackId === `gdc_plugin_track-${now}`
        })
        newTrack.adapter.filters.set(JSON.stringify(gdcFilters))

        session.views[0].showTrack(trackSnapshot.trackId)
      }
    }))
  
  const ReactComponent = jbrowse.jbrequire(GDCUploadWidgetF)

  return { configSchema, stateModel, ReactComponent }
}