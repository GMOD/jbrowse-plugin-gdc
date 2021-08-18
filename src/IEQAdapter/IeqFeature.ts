import { Feature } from '@jbrowse/core/util/simpleFeature'

interface FeatureData {
  [key: string]: unknown
  refName: string
  start: number
  end: number
  name?: string
}

/**
 * Isoform Expression Quantification Adapter
 */
export default class IeqFeature implements Feature {
  private iso: any
  private data: FeatureData
  private _id: string

  constructor(args: { iso: any; id: string }) {
    this.iso = args.iso
    this.data = this.dataFromIso(this.iso)
    this._id = args.id
  }

  get(field: string): any {
    return this.data[field] || this.iso[field]
  }

  set(): void {}

  parent(): undefined {
    return undefined
  }

  children(): undefined {
    return undefined
  }

  tags(): string[] {
    const t = [...Object.keys(this.data), ...Object.keys(this.iso)]
    return t
  }

  id(): string {
    return this._id
  }

  dataFromIso(iso: any): FeatureData {
    const featureData: FeatureData = {
      refName: iso.chromosome,
      start: +iso.start - 1,
      end: +iso.end,
      name: `${iso.mirna_id}, ${iso.read_count} reads`,
      strand: 1,
    }
    return featureData
  }

  toJSON(): any {
    return {
      uniqueId: this._id,
      ...this.iso,
      ...this.data,
    }
  }
}
