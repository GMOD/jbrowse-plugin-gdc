import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'

import GDCFilterWidget from './GDCFilterWidget'
import GDCFeatureWidgetF from './GDCFeatureWidget'
import GDCUploadWidgetF from './GDCUploadWidget'
import LinearGDCDisplay from './LinearGDCDisplay'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'

export default class GDCPlugin extends Plugin {
  name = 'GDCPlugin'

  install(pluginManager: PluginManager) {
    const AdapterType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/AdapterType']
    const TrackType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/TrackType']
    const WidgetType =
      pluginManager.lib['@jbrowse/core/pluggableElementTypes/WidgetType']
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as import('@jbrowse/plugin-linear-genome-view').default
    const { BaseLinearDisplayComponent } = LGVPlugin.exports

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'GDCAdapter',
          configSchema: GDCAdapterConfigSchema,
          AdapterClass: GDCAdapterClass,
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

    pluginManager.addWidgetType(() => {
      const { configSchema, stateModel, ReactComponent } = pluginManager.load(
        GDCUploadWidgetF,
      )

      return new WidgetType({
        name: 'GDCUploadWidget',
        heading: 'GDC JSON',
        configSchema,
        stateModel,
        ReactComponent,
      })
    })
  }
}
