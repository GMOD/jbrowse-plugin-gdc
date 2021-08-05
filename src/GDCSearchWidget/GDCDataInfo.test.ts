import { mapDataInfo, mapGDCExploreConfig } from './GDCDataInfo'

const uri = 'path/to/some.uri'
const authHeader = 'X-Auth-Token'
const authToken = ''

test('maps data information to CNV', async () => {
  const result = mapDataInfo('txt-Copy Number Variation', uri)

  expect(result).toEqual({
    config: {
      type: 'QuantitativeTrack',
      adapter: {
        type: 'SegmentCNVAdapter',
        segLocation: { uri, authHeader, authToken },
      },
    },
    prefix: 'seg',
  })
})

test('maps data information to BAM', async () => {
  const indexId = 'some-unique-id'
  const result = mapDataInfo('bam-Sequencing Reads', uri, indexId)

  expect(result).toEqual({
    config: {
      type: 'AlignmentsTrack',
      adapter: {
        index: {
          location: {
            uri: `http://localhost:8010/proxy/data/${indexId}`,
            authHeader,
            authToken,
          },
        },
        type: 'BamAdapter',
        bamLocation: { uri, authHeader, authToken },
      },
    },
    prefix: 'bam',
  })
})

test('maps data information to SNV', async () => {
  const result = mapDataInfo('vcf-Simple Nucleotide Variation', uri)

  expect(result).toEqual({
    config: {
      type: 'VariantTrack',
      adapter: {
        type: 'VcfAdapter',
        vcfLocation: { uri, authHeader, authToken },
      },
    },
    prefix: 'vcf',
  })
})

test('maps data information to SNV', async () => {
  const result = mapDataInfo('maf-Simple Nucleotide Variation', uri)

  expect(result).toEqual({
    config: {
      type: 'VariantTrack',
      adapter: {
        type: 'MafAdapter',
        mafLocation: { uri, authHeader, authToken },
      },
    },
    prefix: 'maf',
  })
})
