import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import { SimpleFeature } from '@jbrowse/core/util'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import PluginManager from '@jbrowse/core/PluginManager'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'

export default class SegmentCNVAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  public config: any

  private setupP?: Promise<Feature[]>

  public constructor(
    config: AnyConfigurationModel,
    getSubAdapter?: getSubAdapterType,
    pluginManager?: PluginManager,
  ) {
    // @ts-ignore
    super(config, getSubAdapter, pluginManager)
    this.config = config
  }

  private async readSeg() {
    const segLocation = readConfObject(
      this.config,
      'segLocation',
    ) as FileLocation
    const fileContents = (await openLocation(
      segLocation,
      // @ts-ignore
      this.pluginManager,
    ).readFile('utf8')) as string
    const lines = fileContents.split('\n')
    const refNames: string[] = []
    const rows: string[] = []
    let columns: string[] = []
    let refNameColumnIndex = 0
    lines.forEach(line => {
      if (columns.length === 0) {
        columns = line.split('\t')
        const chromosome = (element: any) =>
          element.toLowerCase() === 'chromosome'
        refNameColumnIndex = columns.findIndex(chromosome)
      } else {
        if (line.split('\t')[refNameColumnIndex] !== undefined) {
          rows.push(line)
          refNames.push(line.split('\t')[refNameColumnIndex])
        }
      }
    })

    return {
      lines: rows,
      columns,
      refNames: Array.from(new Set(refNames)),
    }
  }

  private parseLine(line: string, columns: string[]) {
    let segment: any = {}
    line.split('\t').forEach((property: string, i: number) => {
      if (property) {
        if (i === 0) {
          segment.id = property
        } else {
          /* some SEG files have different data, this logic is to ensure that we don't need special
             colouring functions to accomodate for those differences...mean and copy number indicate
             the track colouring */
          if (
            columns[i].toLowerCase() === 'segment_mean' ||
            columns[i].toLowerCase() === 'copy_number'
          ) {
            segment.score = +property
          }
          segment[columns[i].toLowerCase()] = property
        }
      }
    })
    return segment
  }

  private async getLines() {
    const { columns, lines } = await this.readSeg()

    return lines.map((line, index) => {
      const segment = this.parseLine(line, columns)
      return new SimpleFeature({
        uniqueId: segment.id,
        id: segment.id,
        start: +segment.start,
        end: +segment.end,
        refName: segment.chromosome,
        score: +segment.score,
        ...segment,
      })
    })
  }

  private async setup() {
    if (!this.setupP) {
      this.setupP = this.getLines()
    }
    return this.setupP
  }

  public async getRefNames(_: BaseOptions = {}) {
    const { refNames } = await this.readSeg()
    return refNames
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
