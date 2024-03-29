import { storeBlobLocation } from '@jbrowse/core/util/tracks'

export interface FileInfo {
  [key: string]: unknown
  type: string
  category: string
  format: string
}

const mapToAdapter = new Map([
  [
    'bam',
    {
      config: { type: 'AlignmentsTrack', adapter: { type: 'BamAdapter' } },
      prefix: 'bam',
    },
  ],
  [
    'maf',
    {
      config: { type: 'MAFTrack', adapter: { type: 'MafAdapter' } },
      prefix: 'maf',
    },
  ],
  [
    'vcf',
    {
      config: { type: 'VariantTrack', adapter: { type: 'VcfAdapter' } },
      prefix: 'vcf',
    },
  ],
  [
    'Copy Number Variation',
    {
      config: {
        type: 'QuantitativeTrack',
        adapter: { type: 'SegmentCNVAdapter' },
      },
      prefix: 'seg',
    },
  ],
  [
    'Methylation Beta Value',
    {
      config: {
        type: 'FeatureTrack',
        adapter: { type: 'MbvAdapter' },
      },
      prefix: 'mbv',
    },
  ],
  [
    'Isoform Expression Quantification',
    {
      config: {
        type: 'IEQTrack',
        adapter: { type: 'IeqAdapter' },
      },
      prefix: 'ieq',
    },
  ],
  [
    'Splice Junction Quantification',
    {
      config: {
        type: 'FeatureTrack',
        adapter: { type: 'SjqAdapter' },
        displays: [{ type: 'LinearArcDisplay' }],
      },
      prefix: 'sjq',
    },
  ],
  [
    'GDC Explore',
    {
      config: { type: 'GDCTrack', adapter: { type: 'GDCAdapter' } },
    },
  ],
  [
    'SSM or Gene',
    {
      config: { type: 'GDCTrack', adapter: { type: 'GDCJSONAdapter' } },
    },
  ],
])

function getPriorityProperty(fileInfo: FileInfo) {
  if (mapToAdapter.has(fileInfo.type)) {
    return fileInfo.type
  } else if (mapToAdapter.has(fileInfo.category)) {
    return fileInfo.category
  } else if (mapToAdapter.has(fileInfo.format)) {
    return fileInfo.format
  } else {
    return ''
  }
}

/**
 * retrieves the config object with appropriate adapter using file info
 *
 * @param fileInfo an array of the format, category, and type of the file
 *
 * @param uri the uri of the data
 *
 * @param indexFileId the fileId of the index file that the data may require
 * (BAM)
 *
 * @returns an object containing the config type and the adapter object
 */
export function mapDataInfo(
  fileInfo: FileInfo,
  uri?: any,
  indexFileId?: string,
  fileBlob?: any,
) {
  const configObject = mapToAdapter.get(getPriorityProperty(fileInfo))

  if (configObject) {
    if (configObject.config.displays) {
      const datenow = Date.now()
      //@ts-expect-error
      configObject.config.displays[0].displayId = `gdc_plugin_track_linear_basic-${datenow}`
    }
    if (fileBlob) {
      // @ts-expect-error
      configObject.config.adapter[`${configObject.prefix}Location`] =
        storeBlobLocation({ blob: fileBlob })
    } else {
      //@ts-expect-error
      configObject.config.adapter[`${configObject.prefix}Location`] = {
        uri: uri,
        authHeader: 'X-Auth-Token',
        locationType: 'UriLocation',
        internetAccountId: 'GDCExternalToken',
      }
      if (indexFileId) {
        //@ts-expect-error
        configObject.config.adapter.index = {
          location: {
            uri: `http://localhost:8010/proxy/data/${indexFileId}`,
            authHeader: 'X-Auth-Token',
            locationType: 'UriLocation',
            internetAccountId: 'GDCExternalToken',
          },
        }
      }
    }
  }

  return configObject
}

/**
 * creates a specialized config for a GDC explore track using filters that have
 * been parsed from a given url
 *
 * @param category 'GDC Explore' or 'SSM or Gene' indicating what kind of
 * adapter to use
 *
 * @param featureType mutation or gene indicating what kind of feature is being
 * displayed
 *
 * @param adapterPropertyValue filters or data indicating what kind of data has
 * been fed to the function
 *
 * @param trackId the id for the track, needs to be passed in to be specified
 * against the unique identifier
 *
 * @returns a configuration object that will create the track
 */
export function mapGDCExploreConfig(
  category: string,
  featureType: string,
  adapterPropertyValue: string,
  trackId: string,
) {
  const configObject = mapToAdapter.get(category)

  const adapterProperty = category == 'GDC Explore' ? 'filters' : 'data'

  if (configObject) {
    const datenow = Date.now()
    const color1 =
      featureType == 'mutation'
        ? "jexl:cast({LOW: 'blue', MODIFIER: 'goldenrod', MODERATE: 'green', HIGH: 'red'})[get(feature,'consequence').hits.edges[.node.transcript.is_canonical == true][0].node.transcript.annotation.vep_impact] || 'lightgray'"
        : "jexl:cast('goldenrod')"
    configObject.config = {
      adapter: {
        ...configObject.config.adapter,
        // @ts-expect-error
        GDCAdapterId: trackId,
        [adapterProperty]: adapterPropertyValue,
        featureType,
      },
      category: undefined,
      displays: [
        {
          // @ts-expect-error
          displayId: `gdc_plugin_track_linear-${datenow}`,
          renderer: {
            color1,
            labels: {
              name: "jexl:get(feature,'genomicDnaChange')",
              type: 'SvgFeatureRenderer',
            },
          },
          type: 'LinearGDCDisplay',
        },
      ],
      type: configObject.config.type,
    }
  }

  return configObject
}
