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
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import PluginManager from '@jbrowse/core/PluginManager'
import { unzip } from '@gmod/bgzf-filehandle'
import { getSubAdapterType } from '@jbrowse/core/data_adapters/dataAdapterCache'

function isGzip(buf: Buffer) {
  return buf[0] === 31 && buf[1] === 139 && buf[2] === 8
}
/**
 * Splice Junction Quantification Adapter
 */
export default class SjqAdapter extends BaseFeatureDataAdapter {
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

  private async readSjq(fileContents: string) {
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
    const buffer = await openLocation(
      readConfObject(this.config, 'sjqLocation'),
      this.pluginManager,
    ).readFile()

    const buf = isGzip(buffer as Buffer)
      ? await unzip(buffer)
      : buffer.toString()
    // 512MB  max chrome string length is 512MB
    if (buf && buf.length > 536_870_888) {
      throw new Error('Data exceeds maximum string length (512MB)')
    }
    const data = new TextDecoder('utf8', { fatal: true }).decode(
      buf as BufferSource,
    )
    return this.readSjq(data)
  }

  private parseLine(line: string, columns: string[]) {
    let sjq: any = {}
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
