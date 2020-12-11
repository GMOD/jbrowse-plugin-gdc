import { ConfigurationSchema } from '@jbrowse/core/configuration'
import type PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import { createBaseTrackConfig, createBaseTrackModel } from '@jbrowse/core/pluggableElementTypes/models'

import GDCFilterWidget from './GDCFilterWidget'
import GDCFeatureWidgetF from './GDCFeatureWidget'
import LinearGDCDisplay from './LinearGDCDisplay'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'

export default class extends Plugin {
  name = 'GDCPlugin'

  install(pluginManager: PluginManager) {
    const AdapterType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/AdapterType']
    const TrackType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/TrackType']
    const WidgetType =
      pluginManager.lib[
        '@jbrowse/core/pluggableElementTypes/WidgetType'
      ]
    const { BaseLinearDisplayComponent }  = pluginManager.getPlugin('LinearGenomeViewPlugin').exports

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'GDCAdapter',
          configSchema: GDCAdapterConfigSchema,
          AdapterClass: pluginManager.load(GDCAdapterClass),
        }),
    )

    pluginManager.addTrackType(() => {
      const configSchema = ConfigurationSchema(
        'GDCTrack',
        {},
        {
          baseConfiguration: createBaseTrackConfig(pluginManager),
          explicitIdentifier: 'trackId',
        },
      )
      return new TrackType({
        name: 'GDCTrack',
        configSchema,
        stateModel: createBaseTrackModel(
          pluginManager,
          'GDCTrack',
          configSchema,
        ),
      })
    })

    pluginManager.addDisplayType(() => {
      const { configSchema, stateModel } = pluginManager.load(LinearGDCDisplay)
      return new DisplayType({
        name: 'LinearGDCDisplay',
        configSchema,
        stateModel,
        trackType: 'GDCTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: BaseLinearDisplayComponent,
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
