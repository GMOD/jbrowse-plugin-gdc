import type PluginManager from '@gmod/jbrowse-core/PluginManager'
import Plugin from '@gmod/jbrowse-core/Plugin'

import GDCFilterWidget from './GDCFilterWidget'
import GDCFeatureWidgetF from './GDCFeatureWidget'
import GDCTrack from './GDCTrack'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'

export default class extends Plugin {
  name = 'GDCPlugin'

  install(pluginManager: PluginManager) {
    const AdapterType =
      pluginManager.lib['@gmod/jbrowse-core/pluggableElementTypes/AdapterType']
    const TrackType =
      pluginManager.lib['@gmod/jbrowse-core/pluggableElementTypes/TrackType']
    const WidgetType =
      pluginManager.lib[
        '@gmod/jbrowse-core/pluggableElementTypes/WidgetType'
      ]

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'GDCAdapter',
          configSchema: GDCAdapterConfigSchema,
          AdapterClass: pluginManager.load(GDCAdapterClass),
        }),
    )

    pluginManager.addTrackType(() => {
      const { configSchema, stateModel } = pluginManager.load(GDCTrack)
      return new TrackType({
        name: 'GDCTrack',
        compatibleView: 'LinearGenomeView',
        configSchema,
        stateModel,
      })
    })

    pluginManager.addWidgetType(() => {
      const {
        configSchema,
        HeadingComponent,
        ReactComponent,
        stateModel,
      } = pluginManager.load(GDCFilterWidget)

      return new WidgetType({
        name: 'GDCFilterWidget',
        HeadingComponent,
        configSchema,
        stateModel,
        ReactComponent,
      })
    })

    pluginManager.addWidgetType(() => {
      const { configSchema, stateModel, ReactComponent } = pluginManager.load(
        GDCFeatureWidgetF,
      )

      return new WidgetType({
        name: 'GDCFeatureWidget',
        heading: 'Feature Details',
        configSchema,
        stateModel,
        ReactComponent,
      })
    })
  }
}
