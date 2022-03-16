import { mapDataInfo, mapGDCExploreConfig } from './GDCDataInfo'

const uri = 'path/to/some.uri'
const authHeader = 'X-Auth-Token'
const internetAccountId = 'GDCExternalToken'
const locationType = 'UriLocation'
const datenow = () => Date.now()

test('maps data information to CNV', async () => {
  const result = mapDataInfo(
    {
      type: 'Copy Number Segment',
      category: 'Copy Number Variation',
      format: 'txt',
    },
    uri,
  )

  expect(result).toEqual({
    config: {
      type: 'QuantitativeTrack',
      adapter: {
        type: 'SegmentCNVAdapter',
        segLocation: {
          uri,
          authHeader,
          internetAccountId,
          locationType,
        },
      },
    },
    prefix: 'seg',
  })
})

test('maps data information to BAM', async () => {
  const indexId = 'some-unique-id'
  const result = mapDataInfo(
    { type: 'Aligned Reads', category: 'Sequencing Reads', format: 'bam' },
    uri,
    indexId,
  )

  expect(result).toEqual({
    config: {
      type: 'AlignmentsTrack',
      adapter: {
        index: {
          location: {
            uri: `http://localhost:8010/proxy/data/${indexId}`,
            authHeader,
            internetAccountId,
            locationType,
          },
        },
        type: 'BamAdapter',
        bamLocation: { uri, authHeader, internetAccountId, locationType },
      },
    },
    prefix: 'bam',
  })
})

test('maps data information to SNV', async () => {
  const result = mapDataInfo(
    {
      type: 'Raw Simple Somatic Mutation',
      category: 'Simple Nucleotide Variation',
      format: 'vcf',
    },
    uri,
  )

  expect(result).toEqual({
    config: {
      type: 'VariantTrack',
      adapter: {
        type: 'VcfAdapter',
        vcfLocation: {
          uri,
          authHeader,
          internetAccountId,
          locationType,
        },
      },
    },
    prefix: 'vcf',
  })
})

test('maps data information to SNV', async () => {
  const realDateNow = Date.now.bind(global.Date)
  const dateNowStub = jest.fn(() => 1530518207007)
  global.Date.now = dateNowStub

  const result = mapDataInfo(
    {
      type: 'Masked Somatic Mutation',
      category: 'Simple Nucleotide Variation',
      format: 'maf',
    },
    uri,
  )

  expect(result).toEqual({
    config: {
      type: 'MAFTrack',
      adapter: {
        type: 'MafAdapter',
        mafLocation: {
          uri,
          authHeader,
          internetAccountId,
          locationType,
        },
      },
    },
    prefix: 'maf',
  })
  global.Date.now = realDateNow
})

test('maps data information to IEQ', async () => {
  const realDateNow = Date.now.bind(global.Date)
  const dateNowStub = jest.fn(() => 1530518207007)
  global.Date.now = dateNowStub

  const result = mapDataInfo(
    {
      type: 'Isoform Expression Quantification',
      category: 'Transcriptome Profiling',
      format: 'txt',
    },
    uri,
  )

  expect(result).toEqual({
    config: {
      type: 'IEQTrack',
      adapter: {
        type: 'IeqAdapter',
        ieqLocation: {
          uri,
          authHeader,
          internetAccountId,
          locationType,
        },
      },
    },
    prefix: 'ieq',
  })
  global.Date.now = realDateNow
})

test('maps gdc explore to config', async () => {
  const realDateNow = Date.now.bind(global.Date)
  const dateNowStub = jest.fn(() => 1530518207007)
  global.Date.now = dateNowStub

  const result = mapGDCExploreConfig(
    'GDC Explore',
    'gene',
    'test-filters',
    'track-id',
  )

  expect(result).toEqual({
    config: {
      adapter: {
        type: 'GDCAdapter',
        filters: 'test-filters',
        featureType: 'gene',
        GDCAdapterId: 'track-id',
      },
      category: undefined,
      displays: [
        {
          displayId: `gdc_plugin_track_linear-${datenow()}`,
          renderer: {
            color1: "jexl:cast('goldenrod')",
            labels: {
              name: "jexl:get(feature,'genomicDnaChange')",
              type: 'SvgFeatureRenderer',
            },
          },
          type: 'LinearGDCDisplay',
        },
      ],
      type: 'GDCTrack',
    },
  })
  global.Date.now = realDateNow
})
