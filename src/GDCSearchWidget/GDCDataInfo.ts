import { storeBlobLocation } from '@jbrowse/core/util/tracks'

const mapToAdapter: Map<string, Object> = new Map([
  [
    'txt-Copy Number Variation',
    {
      config: {
        type: 'QuantitativeTrack',
        adapter: { type: 'SegmentCNVAdapter' },
      },
      prefix: 'seg',
    },
  ],
  [
    'tsv-Copy Number Variation',
    {
      config: {
        type: 'QuantitativeTrack',
        adapter: { type: 'SegmentCNVAdapter' },
      },
      prefix: 'seg',
    },
  ],
  [
    'bam-Sequencing Reads',
    {
      config: { type: 'AlignmentsTrack', adapter: { type: 'BamAdapter' } },
      prefix: 'bam',
    },
  ],
  [
    'vcf-Simple Nucleotide Variation',
    {
      config: { type: 'VariantTrack', adapter: { type: 'VcfAdapter' } },
      prefix: 'vcf',
    },
  ],
  [
    'maf-Simple Nucleotide Variation',
    {
      config: {
        type: 'MAFTrack',
        adapter: { type: 'MafAdapter' },
      },
      prefix: 'maf',
    },
  ],
  [
    'txt-Transcriptome Profiling',
    {
      config: {
        type: 'IEQTrack',
        adapter: { type: 'IeqAdapter' },
      },
      prefix: 'ieq',
    },
  ],
  [
    'txt-DNA Methylation',
    {
      config: {
        type: 'FeatureTrack',
        adapter: { type: 'MbvAdapter' },
      },
      prefix: 'mbv',
    },
  ],
  [
    'tsv-Transcriptome Profiling',
    {
      config: {
        type: 'IEQTrack',
        adapter: { type: 'IeqAdapter' },
      },
      prefix: 'ieq',
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

/**
 * maps the data info to an appropriate data adapter
 * @param category the data category of the file
 * @param uri the uri of the data
 * @param indexFileId the fileId of the index file that the data may require (BAM)
 * @returns an object containing the config type and the adapter object
 */
export function mapDataInfo(
  category: string,
  uri?: any,
  indexFileId?: string,
  fileBlob?: any,
) {
  const configObject = mapToAdapter.get(category)
  let token = window.sessionStorage.getItem('GDCExternalToken-token')

  if (!token) {
    token = ''
    window.sessionStorage.setItem('GDCExternalToken-token', 'undefined')
  }

  if (configObject) {
    //@ts-ignore
    if (configObject.config.displays) {
      const datenow = Date.now()
      //@ts-ignore
      configObject.config.displays[0][
        'displayId'
      ] = `gdc_plugin_track_linear_basic-${datenow}`
    }
    if (fileBlob) {
      //@ts-ignore
      configObject.config.adapter[
        //@ts-ignore
        `${configObject.prefix}Location`
      ] = storeBlobLocation({ blob: fileBlob })
    } else {
      //@ts-ignore
      configObject.config.adapter[`${configObject.prefix}Location`] = {
        uri: uri,
        authHeader: 'X-Auth-Token',
        locationType: 'UriLocation',
        internetAccountId: 'GDCExternalToken',
      }
      if (indexFileId) {
        //@ts-ignore
        configObject.config.adapter['index'] = {
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
 * creates a specialized config for a GDC explore track using filters that have been parsed from a given url
 * @param category 'GDC Explore' or 'SSM or Gene' indicating what kind of adapter to use
 * @param featureType mutation or gene indicating what kind of feature is being displayed
 * @param adapterPropertyValue filters or data indicating what kind of data has been fed to the function
 * @param trackId the id for the track, needs to be passed in to be specified against the unique identifier
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
        ? "jexl:cast({LOW: 'blue', MODIFIER: 'goldenrod', MODERATE: 'orange', HIGH: 'red'})[get(feature,'consequence').hits.edges[.node.transcript.is_canonical == true][0].node.transcript.annotation.vep_impact] || 'lightgray'"
        : "jexl:cast('goldenrod')"
    // @ts-ignore
    configObject.config = {
      adapter: {
        // @ts-ignore
        ...configObject.config.adapter,
        GDCAdapterId: trackId,
        [adapterProperty]: adapterPropertyValue,
        featureType,
      },
      category: undefined,
      displays: [
        {
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
      // @ts-ignore
      type: configObject.config.type,
    }
  }

  // @ts-ignore
  return configObject
}
