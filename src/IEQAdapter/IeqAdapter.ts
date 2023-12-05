import {
  BaseFeatureDataAdapter,
  BaseOptions,
} from '@jbrowse/core/data_adapters/BaseAdapter'
import { FileLocation, Region } from '@jbrowse/core/util/types'
import { openLocation } from '@jbrowse/core/util/io'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import IeqFeature from './IeqFeature'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { readConfObject } from '@jbrowse/core/configuration'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import PluginManager from '@jbrowse/core/PluginManager'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'

/**
 * Isoform Expression Quantification Adapter
 */
export default class IeqAdapter extends BaseFeatureDataAdapter {
  public static capabilities = ['getFeatures', 'getRefNames']

  private setupP?: Promise<Feature[]>

  private async readIeq() {
    const ieqLocation = readConfObject(
      this.config,
      'ieqLocation',
    ) as FileLocation
    const fileContents = await openLocation(
      ieqLocation,
      this.pluginManager,
    ).readFile('utf8')

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

  private parseCoords(property: string) {
    const splitProperty = property.split(':')
    return {
      chromosome: splitProperty[1],
      start: splitProperty[2].split('-')[0],
      end: splitProperty[2].split('-')[1],
      strand: splitProperty[3] === '+' ? 1 : 0,
    }
  }

  private parseLine(line: string, columns: string[]) {
    let iso: any = {}
    line.split('\t').forEach((property: string, i: number) => {
      if (property) {
        if (columns[i] === 'isoform_coords') {
          const parsedProperties = this.parseCoords(property)
          iso = {
            ...iso,
            ...parsedProperties,
          }
        } else {
          iso[columns[i].toLowerCase()] = property
        }
      }
    })
    return iso
  }

  private async getLines() {
    const { columns, lines } = await this.readIeq()

    return lines.map((line, index) => {
      return new IeqFeature({
        iso: this.parseLine(line, columns),
        id: `${this.id}-ieq-${index}`,
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
