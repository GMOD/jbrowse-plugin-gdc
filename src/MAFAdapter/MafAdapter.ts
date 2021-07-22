import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import MafFeature from './MafFeature'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'

export default class MafAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  public config: any

  private setupP?: Promise<Feature[]>

  public constructor(config: AnyConfigurationModel) {
    super(config)
    this.config = config
  }

  private async readMaf() {
    const mafLocation = readConfObject(
      this.config,
      'mafLocation',
    ) as FileLocation
    const fileContents = (await openLocation(mafLocation).readFile(
      'utf8',
    )) as string

    const lines = fileContents.split('\n')
    const header: string[] = []
    const refNames: string[] = []
    const rows: string[] = []
    let columns: string[] = []
    let refNameColumnIndex = 0
    lines.forEach(line => {
      if (line.startsWith('#')) {
        header.push(line)
      } else if (line) {
        if (!columns) {
          columns = line.split('\t')
          refNameColumnIndex = columns.findIndex('Chromosome'.toLowerCase)
        } else {
          rows.push(line)
          refNames.push(line.split('\t')[refNameColumnIndex])
        }
      }
    })

    return {
      header: header.join('\n'),
      lines: rows,
      columns,
      refNames: Array.from(new Set(refNames)),
    }
  }

  private parseLine(line: string, columns: string[]) {
    let mutationObject: any
    line.split('\t').forEach((property: string, i: number) => {
      mutationObject[columns[i]] = property
    })
    return mutationObject
  }

  private async getLines() {
    const { columns, lines } = await this.readMaf()

    return lines.map((line, index) => {
      return new MafFeature({
        mutation: this.parseLine(line, columns),
        id: `${this.id}-maf-${index}`,
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
    const { refNames } = await this.readMaf()
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
