import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'
import { SessionWithWidgets, isAbstractMenuManager } from '@jbrowse/core/util'

import GDCFilterWidgetF from './GDCFilterWidget'
import GDCFeatureWidgetF from './GDCFeatureWidget'
import GDCUploadWidgetF from './GDCUploadWidget'
import GDCSearchWidgetF from './GDCSearchWidget'
import LinearGDCDisplay from './LinearGDCDisplay'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'
import {
  configSchema as segmentCnvConfigSchema,
  AdapterClass as SegmentCNVAdapter,
} from './SegmentCNVAdapter'

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
      return new WidgetType({
        name: 'GDCFilterWidget',
        ...GDCFilterWidgetF(pluginManager),
      })
    })

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'GDCFeatureWidget',
        heading: 'Feature Details',
        ...GDCFeatureWidgetF(pluginManager),
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

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'GDCSearchWidget',
        heading: 'Search GDC',
        ...GDCSearchWidgetF(pluginManager),
      })
    })

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'SegmentCNVAdapter',
          configSchema: segmentCnvConfigSchema,
          AdapterClass: SegmentCNVAdapter,
        }),
    )
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('File', {
        label: 'Add GDC data',
        onClick: (session: SessionWithWidgets) => {
          session.showWidget(
            session.addWidget('GDCSearchWidget', 'gdcSearchWidget'),
          )
        },
      })
    }
  }
}
