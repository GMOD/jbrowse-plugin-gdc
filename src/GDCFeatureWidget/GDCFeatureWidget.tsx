import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Tooltip,
  Link,
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  FeatureDetails,
  BaseCard,
} from '@jbrowse/core/BaseFeatureWidget/BaseFeatureDetail'
import { getGeneProjectsAsync, getMutationProjectsAsync } from './Utility'

const useStyles = makeStyles()({
  table: {
    padding: 0,
  },
  link: {
    color: 'rgb(0, 0, 238)',
  },
})

/**
 * Render the consequence table for a simple somatic mutation
 * @param {*} props
 */
function Consequence(props: { feature: any }) {
  const { classes } = useStyles()
  const { feature } = props
  if (!feature.consequence) {
    return null
  }

  const consequences = feature.consequence.hits.edges

  return (
    <BaseCard title="Consequence">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Gene</TableCell>
              <TableCell>AA Change</TableCell>
              <TableCell>Consequence</TableCell>
              <TableCell>Coding DNA Change</TableCell>
              <TableCell>Impact</TableCell>
              <TableCell>Gene Strand</TableCell>
              <TableCell>Transcript</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(consequences).map(([key, value]: [string, any]) =>
              value ? (
                <TableRow key={key}>
                  <TableCell>
                    <Link
                      className={classes.link}
                      target="_blank"
                      rel="noopener"
                      href={`https://portal.gdc.cancer.gov/genes/${value.node.transcript.gene.gene_id}`}
                      underline="always"
                    >
                      {value.node.transcript.gene.symbol}
                    </Link>
                  </TableCell>
                  <TableCell>{value.node.transcript.aa_change}</TableCell>
                  <TableCell>
                    {value.node.transcript.consequence_type}
                  </TableCell>
                  <TableCell>
                    {value.node.transcript.annotation.hgvsc}
                  </TableCell>
                  <TableCell>
                    {value.node.transcript.annotation.vep_impact ? (
                      <Tooltip
                        title={`VEP ${value.node.transcript.annotation.vep_impact}`}
                        aria-label="help"
                        placement="left"
                      >
                        <div>
                          <Chip
                            label={value.node.transcript.annotation.vep_impact}
                          />
                        </div>
                      </Tooltip>
                    ) : null}
                    {value.node.transcript.annotation.sift_impact ? (
                      <Tooltip
                        title={`SIFT ${value.node.transcript.annotation.sift_impact} (${value.node.transcript.annotation.sift_score})`}
                        aria-label="help"
                        placement="left"
                      >
                        <div>
                          <Chip
                            label={value.node.transcript.annotation.sift_impact}
                          />
                        </div>
                      </Tooltip>
                    ) : null}
                    {value.node.transcript.annotation.polyphen_impact ? (
                      <Tooltip
                        title={`PolyPhen ${value.node.transcript.annotation.polyphen_impact} (${value.node.transcript.annotation.polyphen_score})`}
                        aria-label="help"
                        placement="left"
                      >
                        <div>
                          <Chip
                            label={
                              value.node.transcript.annotation.polyphen_impact
                            }
                          />
                        </div>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    {value.node.transcript.gene.gene_strand === 1 ? (
                      <AddIcon />
                    ) : (
                      <RemoveIcon />
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      className={classes.link}
                      target="_blank"
                      rel="noopener"
                      href={`http://may2015.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${value.node.transcript.transcript_id}`}
                      underline="always"
                    >
                      {value.node.transcript.transcript_id}
                    </Link>
                    {value.node.transcript.is_canonical ? (
                      <Tooltip
                        title="Canonical transcript"
                        aria-label="help"
                        placement="right"
                      >
                        <div>
                          <Chip label="C" />
                        </div>
                      </Tooltip>
                    ) : null}
                  </TableCell>
                </TableRow>
              ) : null,
            )}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

/**
 * Render a single table row for an external link
 */
const ExternalLink = observer(
  (props: { id: string; name: string; link: string }) => {
    const { classes } = useStyles()
    const { id, name, link } = props
    return (
      <TableRow key={`${id}-${name}`}>
        <TableCell>{name}</TableCell>
        <TableCell>
          <Link
            className={classes.link}
            target="_blank"
            rel="noopener"
            href={`${link}${id}`}
            underline="always"
          >
            {id}
          </Link>
        </TableCell>
      </TableRow>
    )
  },
)

/**
 * Render a section for external gene links
 * @param {*} props
 */
function GeneExternalLinks(props: { feature: any }) {
  const { classes } = useStyles()
  const { feature } = props

  const externalLinkArray = [
    {
      id: feature.geneId,
      name: 'GDC',
      link: 'https://portal.gdc.cancer.gov/genes/',
    },
    {
      id: feature.geneId,
      name: 'ENSEMBL',
      link: 'http://www.ensembl.org/id/',
    },
    {
      id: feature.canonicalTranscriptId,
      name: 'Canonical Transcript ID',
      link: 'http://www.ensembl.org/id/',
    },
    {
      id: feature.externalDbIds.hgnc[0],
      name: 'HGNC',
      link: 'https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/',
    },
    {
      id: feature.externalDbIds.uniprotkbSwissprot[0],
      name: 'UniProtKB Swiss-Prot',
      link: 'http://www.uniprot.org/uniprot/',
    },
    {
      id: feature.externalDbIds.entrezGene[0],
      name: 'NCBI',
      link: 'http://www.ncbi.nlm.nih.gov/gene/',
    },
    {
      id: feature.externalDbIds.omimGene[0],
      name: 'OMIM',
      link: 'https://www.omim.org/entry/',
    },
  ]

  return (
    <BaseCard title="External Links">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableBody>
            {externalLinkArray.map((externalLink, key) => (
              <ExternalLink {...externalLink} key={key} />
            ))}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

/**
 * Removes prefix from cosmic ID
 * @param {*} cosmicId Cosmic ID for a mutation
 */
function removeCosmicPrefix(cosmicId: string) {
  return cosmicId.replace('COSM', '').replace('COSN', '')
}

/**
 * Render a row with cosmic links for a mutation
 */
const CosmicLinks = observer((props: { cosmicId: string[] }) => {
  const { classes } = useStyles()
  const { cosmicId } = props
  return (
    <TableRow key="0">
      <TableCell>Cosmic</TableCell>
      <TableCell>
        {cosmicId?.map(value => (
          <Link
            className={classes.link}
            target="_blank"
            rel="noopener"
            href={`https://cancer.sanger.ac.uk/cosmic/mutation/overview?id=${removeCosmicPrefix(
              value,
            )}`}
            key={value}
            underline="always"
          >
            {value}
          </Link>
        ))}
      </TableCell>
    </TableRow>
  )
})

/**
 * Render a section for external mutation links
 * @param {*} props
 */
function SSMExternalLinks(props: { feature: any }) {
  const { classes } = useStyles()
  const { feature } = props

  const externalLinkArray = [
    {
      id: feature.ssmId,
      name: 'GDC',
      link: 'https://portal.gdc.cancer.gov/ssms/',
    },
  ]

  return (
    <BaseCard title="External Links">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableBody>
            {externalLinkArray.map((externalLink, key) => (
              <ExternalLink {...externalLink} key={key} />
            ))}
            {feature.cosmicId ? (
              <CosmicLinks cosmicId={feature.cosmicId} />
            ) : null}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

/**
 * Render a table row for a project related to the mutation
 * @param {*} props
 */
function SSMProject(props: Record<string, any>) {
  const { classes } = useStyles()
  const { projectId, docCount, projectsInformation, gdcProjectsCounts } = props
  const projectInfo = projectsInformation.find(
    (x: any) => x.node.project_id === projectId,
  )
  const gdcProjectCount = gdcProjectsCounts.find(
    (x: any) => x.projectId === projectId,
  )

  return (
    <TableRow key={projectId}>
      <TableCell>
        <Link
          className={classes.link}
          target="_blank"
          rel="noopener"
          href={`https://portal.gdc.cancer.gov/projects/${projectId}`}
          underline="always"
        >
          {projectId}
        </Link>
      </TableCell>
      <TableCell>{projectInfo.node.disease_type.join(', ')}</TableCell>
      <TableCell>{projectInfo.node.primary_site.join(', ')}</TableCell>
      <TableCell>
        {docCount} / {gdcProjectCount.docCount}
      </TableCell>
    </TableRow>
  )
}

/**
 * Render a table of projects based on the selected mutation feature
 * @param {*} props
 */
function SSMProjects(props: Record<string, any>) {
  const { classes } = useStyles()
  const { featureId } = props
  // Case counts for projects associated with the given mutation
  const [mutationProjectsCounts, setMutationProjectsCounts] = useState<any[]>(
    [],
  )
  // General information regarding all projects
  const [projectsInformation, setProjectsInformation] = useState<any[]>([])
  // Case counts for projects across the GDC
  const [gdcProjectsCounts, setGdcProjectsCounts] = useState<any[]>([])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getMutationProjectsAsync(featureId).then(data => {
      setProjectsInformation(data.data.projects.hits.edges)
      setGdcProjectsCounts(
        data.data.viewer.explore.cases.total.project__project_id.buckets,
      )
      setMutationProjectsCounts(
        data.data.viewer.explore.cases.filtered.project__project_id.buckets,
      )
    })
  }, [featureId])

  return (
    <BaseCard title="Projects">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Disease Type</TableCell>
              <TableCell>Site</TableCell>
              <TableCell># Mutation Affected Cases</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mutationProjectsCounts &&
              projectsInformation &&
              gdcProjectsCounts &&
              mutationProjectsCounts.map((project, key) => (
                <SSMProject
                  projectsInformation={projectsInformation}
                  gdcProjectsCounts={gdcProjectsCounts}
                  key={`${key}-${project.projectId}`}
                  {...project}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

/**
 * Render a table row for a project related to the gene
 * @param {*} props
 */
function GeneProject(props: Record<string, any>) {
  const { classes } = useStyles()
  const { projectId, docCount, projectsInformation, cases } = props

  const projectInfo = projectsInformation.find(
    (x: any) => x.node.project_id === projectId,
  )
  const totalProjectCaseCount = cases.total.project__project_id.buckets.find(
    (x: any) => x.projectId === projectId,
  )
  const cnvGainCaseCount = cases.gain.project__project_id.buckets.find(
    (x: any) => x.projectId === projectId,
  )
  const cnvLossCaseCount = cases.loss.project__project_id.buckets.find(
    (x: any) => x.projectId === projectId,
  )
  const cnvTotalCaseCount = cases.cnvTotal.project__project_id.buckets.find(
    (x: any) => x.projectId === projectId,
  )

  return (
    <TableRow key={projectId}>
      <TableCell>
        <Link
          className={classes.link}
          target="_blank"
          rel="noopener"
          href={`https://portal.gdc.cancer.gov/projects/${projectId}`}
          underline="always"
        >
          {projectId}
        </Link>
      </TableCell>
      <TableCell>{projectInfo.node.disease_type.join(', ')}</TableCell>
      <TableCell>{projectInfo.node.primary_site.join(', ')}</TableCell>
      <TableCell>
        {docCount} / {totalProjectCaseCount.docCount}
      </TableCell>
      <TableCell>
        {cnvGainCaseCount ? cnvGainCaseCount.docCount : '0'} /{' '}
        {cnvTotalCaseCount ? cnvTotalCaseCount.docCount : '0'}
      </TableCell>
      <TableCell>
        {cnvLossCaseCount ? cnvLossCaseCount.docCount : '0'} /{' '}
        {cnvTotalCaseCount ? cnvTotalCaseCount.docCount : '0'}
      </TableCell>
    </TableRow>
  )
}

/**
 * Render a table of projects based on the selected gene feature
 * @param {*} props
 */
function GeneProjects(props: Record<string, any>) {
  const { classes } = useStyles()
  const { featureId } = props

  const [projectsInformation, setProjectsInformation] = useState<any[]>([]) // General information regarding all projects
  const [geneProjectsCounts, setGeneProjectsCounts] = useState<any[]>([]) // Case counts for projects associated with the given gene
  const [cases, setCases] = useState<any[]>([]) // Case counts for various projects and filters

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getGeneProjectsAsync(featureId).then(data => {
      setProjectsInformation(data.data.projects.hits.edges)
      setCases(data.data.viewer.explore.cases)
      setGeneProjectsCounts(
        data.data.viewer.explore.cases.filtered.project__project_id.buckets,
      )
    })
  }, [featureId])

  return (
    <BaseCard {...props} title="Projects">
      <div style={{ width: '100%', maxHeight: 600, overflow: 'auto' }}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Disease Type</TableCell>
              <TableCell>Site</TableCell>
              <TableCell># Mutation Affected Cases</TableCell>
              <TableCell># CNV Gains</TableCell>
              <TableCell># CNV Losses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases &&
              projectsInformation &&
              geneProjectsCounts?.map((project, key) => (
                <GeneProject
                  cases={cases}
                  projectsInformation={projectsInformation}
                  key={`${key}-${project.projectId}`}
                  {...project}
                />
              ))}
          </TableBody>
        </Table>
      </div>
    </BaseCard>
  )
}

/**
 * Extended feature detail widget for GDC features
 * @param {*} props
 */
function GDCFeatureDetails(props: Record<string, any>) {
  const { model } = props
  const feat = JSON.parse(JSON.stringify(model.featureData))
  const {
    consequence,
    geneId,
    ssmId,
    cosmicId,
    canonicalTranscriptId,
    externalDbIds,
    percentage,
    numOfCasesInCohort,
    ...rest
  } = feat
  return (
    <Paper data-testid="variant-widget">
      <FeatureDetails feature={rest} model={model} {...props} />
      <Divider />
      {feat.geneId !== undefined ? <GeneExternalLinks feature={feat} /> : null}
      {feat.ssmId !== undefined ? <SSMExternalLinks feature={feat} /> : null}
      <Divider />
      {feat.ssmId !== undefined ? <Consequence feature={feat} /> : null}
      <Divider />
      {feat.geneId !== undefined ? (
        <GeneProjects featureId={feat.geneId} />
      ) : null}
      {feat.ssmId !== undefined ? <SSMProjects featureId={feat.ssmId} /> : null}
    </Paper>
  )
}

export default observer(GDCFeatureDetails)