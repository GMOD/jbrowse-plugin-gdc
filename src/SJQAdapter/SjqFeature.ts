import { Feature } from '@jbrowse/core/util/simpleFeature'

interface FeatureData {
  [key: string]: unknown
  refName: string
  start: number
  end: number
  name?: string
}

/**
 * Splice Junction Quantification Adapter
 */
export default class SjqFeature implements Feature {
  private sjq: any
  private data: FeatureData
  private _id: string

  constructor(args: { sjq: any; id: string }) {
    this.sjq = args.sjq
    this.data = this.dataFromSjq(this.sjq)
    this._id = args.id
  }

  get(field: string): any {
    return this.data[field] || this.sjq[field]
  }

  set(): void {}

  parent(): undefined {
    return undefined
  }

  children(): undefined {
    return undefined
  }

  tags(): string[] {
    const t = [...Object.keys(this.data), ...Object.keys(this.sjq)]
    return t
  }

  id(): string {
    return this._id
  }

  // #chromosome	intron_start	intron_end	strand	intron_motif	annotation	n_unique_map	n_multi_map	max_splice_overhang
  dataFromSjq(sjq: any): FeatureData {
    const featureData: FeatureData = {
      refName: sjq.chromosome,
      start: +sjq.intron_start - 1,
      end: +sjq.intron_end,
      score: +sjq.n_unique_map + +sjq.n_multi_map,
      name: `unique: ${sjq.n_unique_map}, multi: ${sjq.n_multi_map}`,
    }
    return featureData
  }

  toJSON(): any {
    return {
      uniqueId: this._id,
      ...this.sjq,
      ...this.data,
    }
  }
}
