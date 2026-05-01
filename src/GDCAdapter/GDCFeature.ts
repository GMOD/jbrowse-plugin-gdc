import type {
  SimpleFeatureSerialized,
  Feature,
} from '@jbrowse/core/util/simpleFeature'

interface FeatureData {
  [key: string]: unknown
  refName: string
  start: number
  end: number
  type: string
}

export default class GDCFeature implements Feature {
  private gdcObject: any

  private data: FeatureData

  private uniqueId: string

  private featureType: string

  constructor(args: { gdcObject: any; id: string; featureType: string }) {
    this.gdcObject = args.gdcObject
    this.featureType = args.featureType ? args.featureType : 'mutation'
    this.data = this.dataFromGDCObject(this.gdcObject, this.featureType)
    this.uniqueId = args.id
  }

  get(field: string) {
    return this.gdcObject[field] || this.data[field]
  }

  set() {}

  parent() {
    return undefined
  }

  children() {
    return undefined
  }

  tags(): string[] {
    const t = [...Object.keys(this.data), ...Object.keys(this.gdcObject)]
    return t
  }

  id(): string {
    return this.uniqueId
  }

  dataFromGDCObject(gdcObject: any, featureType: string): FeatureData {
    // Defaults to mutation values
    const featureData: FeatureData = {
      refName: gdcObject.chromosome,
      type: gdcObject.mutationType,
      start: gdcObject.startPosition - 1,
      end: gdcObject.endPosition,
    }

    switch (featureType) {
      case 'gene': {
        featureData.start = gdcObject.geneStart - 1
        featureData.end = gdcObject.geneEnd
        featureData.refName = gdcObject.geneChromosome
        featureData.type = gdcObject.biotype
        featureData.note = gdcObject.symbol
        break
      }
      default:
    }

    return featureData
  }

  toJSON(): SimpleFeatureSerialized {
    return {
      uniqueId: this.uniqueId,
      ...this.data,
      ...this.gdcObject,
    }
  }
}
