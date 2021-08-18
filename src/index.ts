import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'
import { SessionWithWidgets, isAbstractMenuManager } from '@jbrowse/core/util'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import { version } from '../package.json'

import GDCFilterWidgetF from './GDCFilterWidget'
import GDCFeatureWidgetF from './GDCFeatureWidget'
import GDCSearchWidgetF from './GDCSearchWidget'
import LinearGDCDisplay from './LinearGDCDisplay'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'
import {
  configSchema as GDCJSONConfigSchema,
  AdapterClass as GDCJSONAdapter,
} from './GDCJSONAdapter'
import {
  configSchema as segmentCnvConfigSchema,
  AdapterClass as SegmentCNVAdapter,
} from './SegmentCNVAdapter'
import {
  configSchema as mafConfigSchema,
  AdapterClass as MafAdapter,
} from './MAFAdapter'
import {
  configSchema as ieqConfigSchema,
  AdapterClass as IeqAdapter,
} from './IEQAdapter'

export default class GDCPlugin extends Plugin {
  name = 'GDCPlugin'
  version = version

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

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'MafAdapter',
          configSchema: mafConfigSchema,
          AdapterClass: MafAdapter,
        }),
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'IeqAdapter',
          configSchema: ieqConfigSchema,
          AdapterClass: IeqAdapter,
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

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'GDCJSONAdapter',
          configSchema: GDCJSONConfigSchema,
          AdapterClass: GDCJSONAdapter,
        }),
    )
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('File', {
        label: 'Add GDC data',
        icon: CloudUploadIcon,
        onClick: (session: SessionWithWidgets) => {
          session.showWidget(
            session.addWidget('GDCSearchWidget', 'gdcSearchWidget'),
          )
        },
      })
    }

    pluginManager.jexl.addFunction('mafColouring', (feature: any) => {
      const classification = feature.get('variant_classification')

      switch (classification) {
        case 'Intron':
          return 'blue'
        case 'Nonsense_Mutation':
          return 'brown'
        case 'Missense_Mutation':
          return 'goldenrod'
        case 'Silent':
          return 'orange'
        case 'Splice_Site':
          return 'green'
        case 'Translation_Start_Site':
          return 'skyblue'
        case 'Nonstop_Mutation':
          return 'red'
        case 'IGR':
          return 'violet'
        case 'Frame_Shift_Del':
          return 'pink'
        case 'Frame_Shift_Ins':
          return 'olive'
        case 'In_Frame_Del':
          return 'yellowgreen'
        case 'In_Frame_Ins':
          return 'purple'
        case "3'UTR":
          return 'lightgray'
        case "3'Flank":
          return 'maroon'
        case "5'UTR":
          return 'lime'
        case "5'Flank":
          return 'magenta'
        case 'RNA':
          return 'cyan'
        case 'Targeted_Region':
          return 'crimson'
        default:
          return 'black'
      }
    })

    pluginManager.jexl.addFunction('switch', (feature: any, hlBy: any) => {
      hlBy = JSON.parse(hlBy)
      const filteredConsequences = feature
        .get('consequence')
        .hits.edges.filter((cons: any) => cons.node.transcript.is_canonical)
      const impact =
        filteredConsequences[0].node.transcript.annotation[hlBy.attributeName]
      const attrValue = feature.get(hlBy.attributeName)
      const target = impact ? impact : attrValue
      let colour = 'black'
      hlBy.values.forEach((element: any) => {
        if (target === element.name) {
          colour = `${element.colour}`
        }
      })
      return colour
    })

    pluginManager.jexl.addFunction(
      'ieqColouring',
      (feature: any, attributeName: string) => {
        const percentage = feature.get(attributeName)
        const denom = Math.ceil(Math.log10(6060))
        const val = Math.abs((100 * Math.log10(percentage)) / denom - 200)
        console.log(`abs(100 * log10(${percentage}) / ${denom} - 100) = ${val}`)
        return `rgb(184,${val},11)`
      },
    )

    pluginManager.jexl.addFunction(
      'rgb',
      (feature: any, attributeName: string) => {
        const percentage = feature.get(attributeName)
        return `rgb(0,${percentage},0)`
      },
    )
  }
}
