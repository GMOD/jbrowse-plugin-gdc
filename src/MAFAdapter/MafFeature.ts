import { objectTypeSpreadProperty } from '@babel/types'
import { Feature } from '@jbrowse/core/util/simpleFeature'

interface FeatureData {
  [key: string]: unknown
  refName: string
  start: number
  end: number
  name: string
  note: string
  ncbi_build?: string
  strand?: string
  variant_classification?: string
  variant_type?: string
  reference_allele?: string
  tumor_seq_allele1?: string
  tumor_seq_allele2?: string
}

export default class MafFeature implements Feature {
  private mutation: any
  private data: FeatureData
  private _id: string

  constructor(args: { mutation: any; id: string }) {
    this.mutation = args.mutation
    this.data = this.dataFromMutation(this.mutation)
    this._id = args.id
  }

  get(field: string): any {
    return this.data[field] || this.mutation[field]
  }

  set(): void {}

  parent(): undefined {
    return undefined
  }

  children(): undefined {
    return undefined
  }

  tags(): string[] {
    const t = [...Object.keys(this.data), ...Object.keys(this.mutation)]
    return t
  }

  id(): string {
    return this._id
  }

  dataFromMutation(mutation: any): FeatureData {
    const featureData: FeatureData = {
      refName: mutation.chromosome,
      start: mutation.start_position - 1,
      end: mutation.end_position,
      name: `${mutation.chromosome}:g.${mutation.start_position}${mutation.tumor_seq_allele1}>${mutation.tumor_seq_allele2}`,
      note: mutation.hgvsc,
    }
    return featureData
  }

  toJSON(): any {
    return {
      uniqueId: this._id,
      ...this.mutation,
      ...this.data,
    }
  }
}
