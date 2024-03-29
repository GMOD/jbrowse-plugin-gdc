import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import SjqFeature from './SjqFeature'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import pako from 'pako'

/**
 * Splice Junction Quantification Adapter
 */
export default class SjqAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  private setupP?: Promise<Feature[]>

  private readSjq(fileContents: string) {
    const lines = fileContents.split('\n')
    const rows: string[] = []
    let columns: string[] = []
    lines.forEach(line => {
      if (line) {
        if (columns.length === 0) {
          columns = line.split('\t')
        } else {
          rows.push(line)
        }
      }
    })

    return {
      lines: rows,
      columns,
    }
  }

  private async decodeFileContents() {
    const sjqLocation = readConfObject(
      this.config,
      'sjqLocation',
    ) as FileLocation

    const fileContents = await openLocation(
      sjqLocation,
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

    return this.readSjq(str)
  }

  private parseLine(line: string, columns: string[]) {
    const sjq = {} as Record<string, unknown>
    line.split('\t').forEach((property: string, i: number) => {
      // Source: https://stackoverflow.com/questions/4374822/remove-all-special-characters-with-regexp
      columns[i] = columns[i].toLowerCase().replace(/[^\w\s]/gi, '')
      if (property) {
        sjq[columns[i].toLowerCase()] = property
      }
    })
    return sjq
  }

  private async getLines() {
    const { columns, lines } = await this.decodeFileContents()

    return lines.map((line, index) => {
      return new SjqFeature({
        sjq: this.parseLine(line, columns),
        id: `${this.id}-sjq-${index}`,
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
    return [
      'chr1',
      'chr2',
      'chr3',
      'chr4',
      'chr5',
      'chr6',
      'chr7',
      'chr8',
      'chr9',
      'chr10',
      'chr11',
      'chr12',
      'chr13',
      'chr14',
      'chr15',
      'chr16',
      'chr17',
      'chr18',
      'chr19',
      'chr20',
      'chr21',
      'chr22',
      'chrX',
      'chrY',
    ]
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
