import { ConfigurationSchema } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import InternetAccountType from '@jbrowse/core/pluggableElementTypes/InternetAccountType'
import {
  createBaseTrackConfig,
  createBaseTrackModel,
} from '@jbrowse/core/pluggableElementTypes/models'
import { SessionWithWidgets, isAbstractMenuManager } from '@jbrowse/core/util'
import { FileLocation } from '@jbrowse/core/util/types'
import {
  AdapterGuesser,
  getFileName,
  TrackTypeGuesser,
} from '@jbrowse/core/util/tracks'
import { DataExploration } from './UI/Icons'
import { version } from '../package.json'

import GDCFilterWidgetF from './GDCFilterWidget'
import {
  configSchema as gdcFeatureWidgetConfigSchema,
  stateModelFactory as gdcFeatureWidgetStateModelFactory,
} from './GDCFeatureWidget'
import GDCFeatureWidgetComponent from './GDCFeatureWidget/GDCFeatureWidget'
import GDCSearchWidgetF from './GDCSearchWidget'
import LinearGDCDisplayF from './LinearGDCDisplay'
import LinearIEQDisplayF from './LinearIEQDisplay'
import LinearMAFDisplay from './LinearMAFDisplay'

import GDCAdapterConfigSchema from './GDCAdapter/configSchema'
import GDCAdapterClass from './GDCAdapter/GDCAdapter'
import {
  configSchema as segmentCnvConfigSchema,
  AdapterClass as SegmentCNVAdapter,
} from './SegmentCNVAdapter'
import {
  configSchema as mafConfigSchema,
  AdapterClass as MafAdapter,
} from './MAFAdapter'
import {
  configSchema as mbvConfigSchema,
  AdapterClass as MbvAdapter,
} from './MBVAdapter'
import {
  configSchema as ieqConfigSchema,
  AdapterClass as IeqAdapter,
} from './IEQAdapter'
import {
  configSchema as sjqConfigSchema,
  AdapterClass as SjqAdapter,
} from './SJQAdapter'
import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'
import TrackType from '@jbrowse/core/pluggableElementTypes/TrackType'
import WidgetType from '@jbrowse/core/pluggableElementTypes/WidgetType'
import {
  configSchema as GDCInternetAccountConfigSchema,
  modelFactory as GDCInternetAccountModelFactory,
} from './GDCInternetAccount'
export default class GDCPlugin extends Plugin {
  name = 'GDCPlugin'

  version = version as string

  install(pluginManager: PluginManager) {
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as import('@jbrowse/plugin-linear-genome-view').default
    const { BaseLinearDisplayComponent } = LGVPlugin.exports

    const adapterCategoryHeader = 'GDC Plugin Adapters'

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'GDCAdapter',
          configSchema: GDCAdapterConfigSchema,
          adapterMetadata: {
            hiddenFromGUI: true,
          },
          AdapterClass: GDCAdapterClass,
        }),
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'SjqAdapter',
          configSchema: sjqConfigSchema,
          displayName: 'Splice Junction Quantification Adapter',
          adapterMetadata: {
            category: adapterCategoryHeader,
            hiddenFromGUI: false,
            description: '',
          },
          AdapterClass: SjqAdapter,
        }),
    )

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const adapterName = 'SjqAdapter'

          if (adapterHint === adapterName) {
            return {
              type: adapterName,
              sjqLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'MbvAdapter',
          configSchema: mbvConfigSchema,
          displayName: 'Methylation Beta Value Adapter',
          adapterMetadata: {
            category: adapterCategoryHeader,
            hiddenFromGUI: false,
            description: '',
          },
          AdapterClass: MbvAdapter,
        }),
    )

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const adapterName = 'MbvAdapter'

          if (adapterHint === adapterName) {
            return {
              type: adapterName,
              ieqLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'MafAdapter',
          configSchema: mafConfigSchema,
          adapterMetadata: {
            category: adapterCategoryHeader,
            hiddenFromGUI: false,
            description: '',
          },
          AdapterClass: MafAdapter,
        }),
    )

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const regexGuess = /\.maf$/i
          const adapterName = 'MafAdapter'
          const fileName = getFileName(file)

          if (regexGuess.test(fileName) || adapterHint === adapterName) {
            return {
              type: adapterName,
              mafLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.addToExtensionPoint(
      'Core-guessTrackTypeForLocation',
      (trackTypeGuesser: TrackTypeGuesser) => {
        return (adapterName: string) => {
          if (adapterName === 'MafAdapter') {
            return 'MAFTrack'
          }
          return trackTypeGuesser(adapterName)
        }
      },
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'IeqAdapter',
          configSchema: ieqConfigSchema,
          displayName: 'Isoform Expression Quantification Adapter',
          adapterMetadata: {
            category: adapterCategoryHeader,
            hiddenFromGUI: false,
            description: '',
          },
          AdapterClass: IeqAdapter,
        }),
    )

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const adapterName = 'IeqAdapter'

          if (adapterHint === adapterName) {
            return {
              type: adapterName,
              ieqLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.addToExtensionPoint(
      'Core-guessTrackTypeForLocation',
      (trackTypeGuesser: TrackTypeGuesser) => {
        return (adapterName: string) => {
          if (adapterName === 'IeqAdapter') {
            return 'IEQTrack'
          }
          return trackTypeGuesser(adapterName)
        }
      },
    )

    pluginManager.addAdapterType(
      () =>
        new AdapterType({
          name: 'SegmentCNVAdapter',
          configSchema: segmentCnvConfigSchema,
          displayName: 'Segment Copy Number Variation Adapter',
          adapterMetadata: {
            category: adapterCategoryHeader,
            hiddenFromGUI: false,
            description: '',
          },
          AdapterClass: SegmentCNVAdapter,
        }),
    )

    pluginManager.addToExtensionPoint(
      'Core-guessAdapterForLocation',
      (adapterGuesser: AdapterGuesser) => {
        return (
          file: FileLocation,
          index?: FileLocation,
          adapterHint?: string,
        ) => {
          const regexGuess = /\.seg$/i
          const adapterName = 'SegmentCNVAdapter'
          const fileName = getFileName(file)

          if (regexGuess.test(fileName) || adapterHint === adapterName) {
            return {
              type: adapterName,
              segLocation: file,
            }
          }
          return adapterGuesser(file, index, adapterHint)
        }
      },
    )

    pluginManager.addToExtensionPoint(
      'Core-guessTrackTypeForLocation',
      (trackTypeGuesser: TrackTypeGuesser) => {
        return (adapterName: string) => {
          if (adapterName === 'SegmentCNVAdapter') {
            return 'QuantitativeTrack'
          }
          return trackTypeGuesser(adapterName)
        }
      },
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
      const { configSchema, stateModel } = LinearGDCDisplayF(pluginManager)
      return new DisplayType({
        name: 'LinearGDCDisplay',
        configSchema,
        stateModel,
        trackType: 'GDCTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: BaseLinearDisplayComponent,
      })
    })

    pluginManager.addTrackType(() => {
      const configSchema = ConfigurationSchema(
        'IEQTrack',
        {},
        {
          baseConfiguration: createBaseTrackConfig(pluginManager),
          explicitIdentifier: 'trackId',
        },
      )
      return new TrackType({
        name: 'IEQTrack',
        configSchema,
        stateModel: createBaseTrackModel(
          pluginManager,
          'IEQTrack',
          configSchema,
        ),
      })
    })

    pluginManager.addDisplayType(() => {
      const { configSchema, stateModel } = LinearIEQDisplayF(pluginManager)
      return new DisplayType({
        name: 'LinearIEQDisplay',
        configSchema,
        stateModel,
        trackType: 'IEQTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: BaseLinearDisplayComponent,
      })
    })

    pluginManager.addTrackType(() => {
      const configSchema = ConfigurationSchema(
        'MAFTrack',
        {},
        {
          baseConfiguration: createBaseTrackConfig(pluginManager),
          explicitIdentifier: 'trackId',
        },
      )
      return new TrackType({
        name: 'MAFTrack',
        configSchema,
        stateModel: createBaseTrackModel(
          pluginManager,
          'MAFTrack',
          configSchema,
        ),
      })
    })

    pluginManager.addDisplayType(() => {
      const { configSchema, stateModel } = pluginManager.load(LinearMAFDisplay)
      return new DisplayType({
        name: 'LinearMAFDisplay',
        configSchema,
        stateModel,
        trackType: 'MAFTrack',
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
        configSchema: gdcFeatureWidgetConfigSchema,
        stateModel: gdcFeatureWidgetStateModelFactory(pluginManager),
        ReactComponent: GDCFeatureWidgetComponent,
      })
    })

    pluginManager.addWidgetType(() => {
      return new WidgetType({
        name: 'GDCSearchWidget',
        heading: 'Search GDC',
        ...GDCSearchWidgetF(pluginManager),
      })
    })

    pluginManager.addInternetAccountType(() => {
      return new InternetAccountType({
        name: 'GDCInternetAccount',
        configSchema: GDCInternetAccountConfigSchema,
        stateModel: GDCInternetAccountModelFactory(
          GDCInternetAccountConfigSchema,
        ),
      })
    })
  }

  configure(pluginManager: PluginManager) {
    if (isAbstractMenuManager(pluginManager.rootModel)) {
      pluginManager.rootModel.appendToMenu('Tools', {
        label: 'GDC Data Import',
        icon: DataExploration,
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

    pluginManager.jexl.addFunction(
      'cancer',
      (feature: any, attributeName: string) => {
        return feature.get(attributeName) ? 'red' : 'blue'
      },
    )
  }
}
