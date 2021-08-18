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
        type: 'VariantTrack',
        adapter: { type: 'MafAdapter' },
        displays: [
          {
            type: 'LinearBasicDisplay',
            renderer: {
              color1: 'jexl:mafColouring(feature)',
              type: 'SvgFeatureRenderer',
            },
          },
        ],
      },
      prefix: 'maf',
    },
  ],
  [
    'txt-Transcriptome Profiling',
    {
      config: {
        type: 'ReferenceSequenceTrack',
        adapter: { type: 'IeqAdapter' },
        displays: [
          {
            type: 'LinearBasicDisplay',
            renderer: {
              color1: `jexl:ieqColouring(feature, 'reads_per_million_mirna_mapped')`,
              type: 'SvgFeatureRenderer',
            },
          },
        ],
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
  let token = window.sessionStorage.getItem('GDCToken')

  if (!token) token = ''

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
        authToken: `${token}`,
      }
      if (indexFileId) {
        //@ts-ignore
        configObject.config.adapter['index'] = {
          location: {
            uri: `http://localhost:8010/proxy/data/${indexFileId}`,
            authHeader: 'X-Auth-Token',
            authToken: `${token}`,
          },
        }
      }
    }
  }

  return configObject
}

export function mapGDCExploreConfig(
  category: string,
  featureType: string,
  adapterPropertyValue: string,
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
