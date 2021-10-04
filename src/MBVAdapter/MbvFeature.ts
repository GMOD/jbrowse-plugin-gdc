import { Feature } from '@jbrowse/core/util/simpleFeature'

interface FeatureData {
  [key: string]: unknown
  refName: string
  start: number
  end: number
  name: string
  note: string
}

export default class MbvFeature implements Feature {
  private value: any
  private data: FeatureData
  private _id: string

  constructor(args: { value: any; id: string }) {
    this.value = args.value
    this.data = this.dataFromValue(this.value)
    this._id = args.id
  }

  get(field: string): any {
    return this.data[field] || this.value[field]
  }

  set(): void {}

  parent(): undefined {
    return undefined
  }

  children(): undefined {
    return undefined
  }

  tags(): string[] {
    const t = [...Object.keys(this.data), ...Object.keys(this.value)]
    return t
  }

  id(): string {
    return this._id
  }

  dataFromValue(value: any): FeatureData {
    const featureData: FeatureData = {
      refName: value.chromosome,
      start: +value.start - 1,
      end: +value.end,
      name: `${value['composite element ref']}`,
      note: value['beta_value'],
    }

    return featureData
  }

  toJSON(): any {
    return {
      uniqueId: this._id,
      ...this.value,
      ...this.data,
    }
  }
}
