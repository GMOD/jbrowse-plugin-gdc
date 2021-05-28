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
  import GDCFeature from '../GDCAdapter/GDCFeature'
import { isArray } from '@material-ui/data-grid'

  export default class GDCJSONAdapter extends BaseFeatureDataAdapter {
    public static capabilities = ['getFeatures', 'getRefNames']

    private featureType: string

    private data: string

    private totalData: number

    public constructor(config: AnyConfigurationModel) {
      super(config)
      const featureType = readConfObject(config, 'featureType') as string
      const data = readConfObject(this.config, 'data') as string

      this.featureType = featureType
      this.data = data
      this.totalData = 0
    }

    private convertPropertyCaseToCamel(src: any) {
      const tgt = src
      Object.keys(src).forEach((k) => {
        const toCamel = (str:any) => {
          return str.replace(/([-_][a-z])/ig, ($1:any) => {
            return $1.toUpperCase()
              .replace('_', '');
          });
        };

        if (!isArray(src[k])) {
          tgt[toCamel(k)] = src[k]
          delete tgt[k]
        }
      })

      return tgt
    }

    private constructMutation(obj: any) {
      const consequence = obj.consequence

      let edges = []
      for (const transcript of consequence) {
        edges.push({
          node: {
            ...transcript
          }
        })
      }

      const gdcObject = this.convertPropertyCaseToCamel(obj)

      const genomicDnaChange = gdcObject.genomicDnaChange

      // properties derived from genomic dna change
      gdcObject.chromosome = genomicDnaChange.split(":")[0]
      gdcObject.referenceAllele = genomicDnaChange.split(".")[1].split(">")[0].slice(-1)
      gdcObject.startPosition = parseInt(genomicDnaChange.split(".")[1].split(">")[0].slice(0, -1))
      gdcObject.endPosition = gdcObject.startPosition
      // constant properties for mutations
      gdcObject.mutationType = "Simple Somatic Mutation"
      gdcObject.nciBuild = "GRCh38"
      gdcObject.consequence = {
        hits: {
          edges
        }
      }
      // cohort, score and percentage properties
      const cohortCount = this.totalData
      gdcObject.score = 1 // TODO: shouldn't be hardcoded, need to devise a way to get the proper score

      const denom = Math.ceil(Math.log10(cohortCount))
      gdcObject.numOfCasesInCohort = cohortCount
      gdcObject.percentage = (100 * Math.log10(gdcObject.score)) / denom + 100
      gdcObject.occurrenceInCohort = `${gdcObject.score} / ${cohortCount}`

      return gdcObject
    }

    private constructGene(obj: any) {
      const gdcObject = this.convertPropertyCaseToCamel(obj)
      return gdcObject
    }

    private constructFeature(obj: any, idField: string) {
      const gdcObject = idField === 'ssmId' ? this.constructMutation(obj) : this.constructGene(obj)

      return new GDCFeature({
        gdcObject,
        id: gdcObject[idField],
        featureType: this.featureType,
      })
    }

    public async getRefNames() {
      return [
        'chr1',
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
        'chr2',
        'chr20',
        'chr21',
        'chr22',
        'chr3',
        'chr4',
        'chr5',
        'chr6',
        'chr7',
        'chr8',
        'chr9',
        'chrX',
        'chrY',
      ]
    }
  
    public getFeatures(region: Region, opts: BaseOptions = {}) {
      const { refName, start, end } = region
      return ObservableCreate<Feature>(async observer => {
        try {
          const idField = this.featureType === 'mutation' ? 'ssmId' : 'geneId'
          const parsedData = JSON.parse(this.data)
          this.totalData = Object.keys(parsedData).length
          var features = parsedData.map((value:any) => {
            return this.constructFeature(value, idField)
          })
          features.forEach((feature:GDCFeature) => {
            if (
              feature.get('refName') === refName &&
              feature.get('end') > start &&
              feature.get('start') < end
            ) {
              observer.next(feature)
            }
          })
        } catch (e) {
          observer.error(e)
        }
        observer.complete()
      }, opts.signal)
    }
  
    public freeResources(): void {}
  }
  