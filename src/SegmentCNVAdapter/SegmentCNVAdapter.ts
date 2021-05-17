import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SimpleFeature, { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'

export default class SegmentCNVAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  private setupP?: Promise<Feature[]>

  public constructor(config: AnyConfigurationModel) {
    super(config)
  }

  public async getLines() {
    const segLocation = readConfObject(
      this.config,
      'segLocation',
    ) as FileLocation
    const lines = (await openLocation(segLocation).readFile('utf8')) as string
    return lines
      .split('\n')
      .slice(1)
      .filter(f => !!f)
      .map(line => {
        const [id, chr, start, end, nprobes, mean] = line.split('\t')
        return new SimpleFeature({
          uniqueId: id,
          id,
          start: +start,
          end: +end,
          refName: chr,
          nprobes: +nprobes,
          mean: +mean,
          score: +mean,
        })
      })
  }

  public async setup() {
    if (!this.setupP) {
      this.setupP = this.getLines()
    }
    return this.setupP
  }

  public async getRefNames(_: BaseOptions = {}) {
    const l = []
    for (let i = 0; i < 23; i++) {
      l.push('' + i)
    }
    return l
  }

  public getFeatures(region: Region, opts: BaseOptions = {}) {
    return ObservableCreate<Feature>(async observer => {
      const feats = await this.setup()
      feats.forEach(f => {
        if (
          f.get('refName') === region.refName &&
          f.get('end') > region.start &&
          f.get('start') < region.end
        ) {
          observer.next(f)
        }
      })
      observer.complete()
    }, opts.signal)
  }

  public freeResources(): void {}
}
