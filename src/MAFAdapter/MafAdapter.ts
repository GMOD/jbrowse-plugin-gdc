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
import pako from 'pako'
export default class MafAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  private setupP?: Promise<Feature[]>

  private readMaf(fileContents: string) {
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
        if (columns.length === 0) {
          columns = line.split('\t')
          refNameColumnIndex = columns.findIndex(
            element => element.toLowerCase() === 'chromosome',
          )
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
    const mutationObject: Record<string, unknown> = {}
    line.split('\t').forEach((property: string, i: number) => {
      if (property) {
        mutationObject[columns[i].toLowerCase()] = property
      }
    })
    return mutationObject
  }

  private async decodeFileContents() {
    const mafLocation = readConfObject(
      this.config,
      'mafLocation',
    ) as FileLocation

    const fileContents = await openLocation(
      mafLocation,
      this.pluginManager,
    ).readFile()

    let str: string
    if (
      typeof fileContents[0] === 'number' &&
      fileContents[0] === 31 &&
      typeof fileContents[1] === 'number' &&
      fileContents[1] === 139 &&
      typeof fileContents[2] === 'number' &&
      fileContents[2] === 8
    ) {
      str = new TextDecoder().decode(pako.inflate(fileContents))
    } else {
      str = fileContents.toString()
    }

    return this.readMaf(str)
  }

  private async getLines() {
    const { columns, lines } = await this.decodeFileContents()

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
    const { refNames } = await this.decodeFileContents()
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
