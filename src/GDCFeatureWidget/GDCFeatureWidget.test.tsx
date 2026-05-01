import React from 'react'
import { vi, describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ThemeProvider } from '@mui/material'
import { createJBrowseTheme } from '@jbrowse/core/ui/theme'

import { GDCExtraPanel } from './GDCFeatureWidget'

describe('GDCTrack widget', () => {
  it('renders mutation extra panel', () => {
    console.warn = vi.fn()

    const feature = {
      uniqueId: '0208efeb-f1e8-57e4-8447-299c5f050380',
      refName: 'chr3',
      type: 'Simple Somatic Mutation',
      start: 377917,
      end: 377918,
      chromosome: 'chr3',
      ssmId: '0208efeb-f1e8-57e4-8447-299c5f050380',
      consequence: {
        hits: {
          edges: [
            {
              node: {
                id: 'U1NNQ29uc2VxdWVuY2U6MDIwOGVmZWItZjFlOC01N2U0LTg0NDctMjk5YzVmMDUwMzgwOjZkYmQ5M2M2LWYwZWYtNTdhZS1iZmQxLWYxM2RlNmM5ZWI0Ng==',
                transcript: {
                  aa_change: 'D618N',
                  annotation: {
                    hgvsc: 'c.1852G>A',
                    polyphen_impact: 'benign',
                    polyphen_score: 0.008,
                    sift_impact: 'tolerated',
                    sift_score: 0.08,
                    vep_impact: 'MODERATE',
                  },
                  consequence_type: 'missense_variant',
                  gene: {
                    gene_id: 'ENSG00000134121',
                    gene_strand: 1,
                    symbol: 'CHL1',
                  },
                  is_canonical: false,
                  transcript_id: 'ENST00000620033',
                },
              },
            },
          ],
        },
      },
      cosmicId: ['COSM1044638'],
      genomicDnaChange: 'chr3:g.377918G>A',
    }

    const { container } = render(
      <ThemeProvider theme={createJBrowseTheme()}>
        <GDCExtraPanel feature={feature} />
      </ThemeProvider>,
    )
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders gene extra panel', () => {
    console.warn = vi.fn()

    const feature = {
      uniqueId: 'ENSG00000134121',
      refName: '3',
      type: 'protein_coding',
      start: 196595,
      end: 409417,
      geneId: 'ENSG00000134121',
      canonicalTranscriptId: 'ENST00000256509',
      externalDbIds: {
        entrezGene: ['10752'],
        hgnc: ['HGNC:1939'],
        omimGene: ['607416'],
        uniprotkbSwissprot: ['O00533'],
      },
      symbol: 'CHL1',
    }

    const { container } = render(
      <ThemeProvider theme={createJBrowseTheme()}>
        <GDCExtraPanel feature={feature} />
      </ThemeProvider>,
    )
    expect(container.firstChild).toMatchSnapshot()
  })
})
