const gdcFilters = {
  op: 'and',
  content: [
    {
      op: 'in',
      content: {
        field: 'cases.project.project_id',
        value: ['TCGA-UCEC'],
      },
    },
    {
      op: 'in',
      content: {
        field: 'genes.is_cancer_gene_census',
        value: ['true'],
      },
    },
    {
      op: 'in',
      content: {
        field: 'ssms.consequence.transcript.annotation.vep_impact',
        value: ['high'],
      },
    },
  ],
}

const gdcResponse = {
  data: {
    viewer: {
      explore: {
        features: {
          hits: {
            edges: [
              {
                node: {
                  chromosome: 'chr3',
                  consequence: {},
                  cosmicId: null,
                  endPosition: 124908333,
                  genomicDnaChange: 'chr3:g.124908333C>T',
                  mutationSubtype: 'Single base substitution',
                  mutationType: 'Simple Somatic Mutation',
                  ncbiBuild: 'GRCh38',
                  numOfCasesInCohort: 12922,
                  occurrenceInCohort: '5 / 12922',
                  percentage: 113.97940008672037,
                  referenceAllele: 'C',
                  score: 5,
                  ssmId: 'fe913ae3-e63e-585c-84cf-f47fcf51b639',
                  startPosition: 124908333,
                },
              },
              {
                node: {
                  chromosome: 'chr3',
                  consequence: {},
                  cosmicId: null,
                  endPosition: 124908160,
                  genomicDnaChange: 'chr3:g.124908160C>T',
                  mutationSubtype: 'Single base substitution',
                  mutationType: 'Simple Somatic Mutation',
                  ncbiBuild: 'GRCh38',
                  numOfCasesInCohort: 12922,
                  occurrenceInCohort: '2 / 12922',
                  percentage: 106.02059991327963,
                  referenceAllele: 'C',
                  score: 2,
                  ssmId: '68e512b9-511f-58e3-8f41-137c6c0291af',
                  startPosition: 124908160,
                },
              },
              {
                node: {
                  chromosome: 'chr3',
                  consequence: {},
                  cosmicId: null,
                  endPosition: 124908195,
                  genomicDnaChange: 'chr3:g.124908195C>A',
                  mutationSubtype: 'Single base substitution',
                  mutationType: 'Simple Somatic Mutation',
                  ncbiBuild: 'GRCh38',
                  numOfCasesInCohort: 12922,
                  occurrenceInCohort: '1 / 12922',
                  percentage: 100,
                  referenceAllele: 'C',
                  score: 1,
                  ssmId: '0198e63f-185f-526f-96e5-f54010ffd2c0',
                  startPosition: 124908195,
                },
              },
            ],
            total: 30,
          },
        },
        filteredCases: {
          hits: {
            total: 12922,
          },
        },
      },
    },
  },
}

export { gdcFilters, gdcResponse }
