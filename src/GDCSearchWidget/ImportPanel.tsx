import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { storeBlobLocation } from '@jbrowse/core/util/tracks'
import {
  Alert,
  Paper,
  Button,
  Typography,
  TextField,
  Chip,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import InsertDriveFile from '@mui/icons-material/InsertDriveFile'
import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/Info'
import TipDialogue from './TipDialogue'
import { makeStyles } from 'tss-react/mui'

import { mapDataInfo, mapGDCExploreConfig } from './GDCDataInfo'
import { GDCSearchModel } from './model'

const MAX_FILE_SIZE = 512 * 1024 ** 2 // 512 MiB
const MAX_FILES = 25
const THEME_SPACING_A = 8 // theme.spacing(2)
const THEME_SPACING_B = 10 // theme.spacing(4)

//@ts-expect-error
function styledBy(property, mapping) {
  // @ts-expect-error
  return props => mapping[props[property]]
}

const useStyles = makeStyles()(theme => ({
  container: {
    margin: THEME_SPACING_A,
  },
  fileInput: {
    marginBottom: THEME_SPACING_A,
  },
  root: {
    margin: 2,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    gap: THEME_SPACING_B,
    padding: THEME_SPACING_A,
    margin: `2px 4px ${THEME_SPACING_A}px 4px`,
  },
  dragAndDropContainer: {
    margin: `${THEME_SPACING_A}px ${THEME_SPACING_A}px 0px ${THEME_SPACING_A}px`,
  },
  dropZone: {
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 2,
    padding: THEME_SPACING_A,
    borderStyle: 'dashed',
    outline: 'none',
    transition: 'border .24s ease-in-out',
    '&:focus': {
      borderColor: theme.palette.secondary.light,
    },
  },
  uploadIcon: {
    color: theme.palette.text.secondary,
  },
  rejectedFiles: {
    marginTop: THEME_SPACING_B,
  },
  listItem: {
    padding: THEME_SPACING_B,
  },
  expandIcon: {
    color: '#FFFFFF',
  },
  error: {
    margin: THEME_SPACING_A,
  },
  errorHeader: {
    background: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: THEME_SPACING_A,
    textAlign: 'center',
  },
  errorMessage: {
    padding: THEME_SPACING_A,
  },
  submitContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '4px',
  },
  addTrackButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  loginPromptContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typoContainer: {
    width: '100%',
  },
  tipContainer: {
    display: 'flex',
    paddingTop: THEME_SPACING_A,
  },
  tipPaper: {
    display: 'flex',
    background: theme.palette.grey[100],
  },
  tipMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: THEME_SPACING_A,
    gap: THEME_SPACING_A,
    alignItems: 'center',
  },
}))

async function fetchFileInfo(query: string) {
  const response = await fetch(
    `http://localhost:8010/proxy/files/${query}?expand=index_files`,
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${response.status} ${await response.text()}`,
    )
  }
  return response.json()
}

const Panel = ({ model }: { model: GDCSearchModel }) => {
  const [dragErrorMessage, setDragErrorMessage] = useState<string>()
  const [success, setSuccess] = useState(false)
  const [dragSuccess, setDragSuccess] = useState(false)
  const [exploreSuccess, setExploreSuccess] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<string>()
  const [trackInfoMessage, setTrackInfoMessage] = useState<string>()
  const [uploadInfoMessage, setUploadInfoMessage] = useState<string>()
  const [fileChip, setFileChip] = useState<string>()

  const session = getSession(model)
  const inputRef = useRef()

  /**
   * uses information about the BEDPE file to display the contents in a spreadsheet view
   * @param uri optional the uri of the BEDPE file being added to be passed to the track
   * @param fileUUID the UUID of the file being added for the title of the view
   * @param fileBlob optional the file being populated from the local machine
   */
  async function addBEDPEView(fileUUID: string, uri?: string, fileBlob?: any) {
    session.addView('SpreadsheetView', {})
    const xView = session.views.length - 1
    session.views[xView].setDisplayName(`GDC BEDPE ${fileUUID}`)
    if (uri) {
      // @ts-expect-error
      session.views[xView].importWizard.setFileSource({
        uri,
        locationType: 'UriLocation',
        authHeader: 'X-Auth-Token',
        internetAccountId: 'GDCExternalToken',
      })
    }
    if (fileBlob) {
      // @ts-expect-error
      session.views[xView].importWizard.setFileSource(
        storeBlobLocation({ blob: fileBlob }),
      )
    }
    // @ts-expect-error
    session.views[xView].importWizard.setFileType('BEDPE')
    // @ts-expect-error
    session.views[xView].importWizard.setSelectedAssemblyName('hg38')
    // @ts-expect-error
    await session.views[xView].importWizard.import('hg38')
  }

  /**
   * uses the provided configuration to add the track to the session and then displays it
   * displays an error message if typeAdapterObject is null
   * @param typeAdapterObject the object from GDCDataInfo with some of the configuration for the track
   * @param trackId the trackId of the track
   * @param name the name of the track
   */
  function addAndShowTrack(
    typeAdapterObject: any,
    trackId: string,
    name: string,
    paper?: string,
  ) {
    if (typeAdapterObject) {
      const conf = {
        ...typeAdapterObject.config,
        trackId,
        name,
        assemblyNames: ['hg38'],
      }
      //@ts-expect-error
      session.addTrackConf({
        ...conf,
      })
      if (session.views.length === 0) {
        session.addView('LinearGenomeView', {})
      }
      //@ts-expect-error
      session.views[0].showTrack(
        trackId,
        {},
        {
          height: 200,
          constraints: { max: 2, min: -2 },
          rendererTypeNameState: 'density',
        },
      )
      if (paper === 'drag') {
        setDragSuccess(true)
      } else if (paper === 'explore') {
        setExploreSuccess(true)
      } else {
        setSuccess(true)
      }
    } else {
      if (paper === 'drag') {
        setDragErrorMessage(
          'Failed to add track.\nThe configuration of this file is not currently supported.',
        )
      } else {
        setTrackErrorMessage(
          'Failed to add track.\nThe configuration of this file is not currently supported.',
        )
      }
    }
  }

  /**
   * helper function to determine the file type of a dragged file. needed
   * because files like BAM and VCF do not have inherent types to extract from
   * the File object
   *
   * @param fileName the name of the file to determine the extension
   * @returns an object of type fileInfo that contains the file format, type, and/or category of the file based on its name
   */
  function determineFileInfo(fileName: string) {
    const format = fileName.split('.')[-1]

    if (fileName.includes('Methylation')) {
      return {
        format,
        type: 'Methylation Beta Value',
        category: 'DNA Methylation',
      }
    }

    if (fileName.includes('splice')) {
      return {
        format,
        type: 'Splice Junction Quantification',
        category: 'Transcriptome Profiling',
      }
    }

    return { format, type: '', category: '' }
  }

  function resetErrorMessages() {
    setTrackErrorMessage(undefined)
    setTrackInfoMessage(undefined)
    setDragErrorMessage(undefined)
    setUploadInfoMessage(undefined)
    setSuccess(false)
    setDragSuccess(false)
    setExploreSuccess(false)
  }

  const handleDelete = () => {
    model.setTrackData(undefined)
    model.setIndexTrackData(undefined)
    setFileChip(undefined)
    setUploadInfoMessage(undefined)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      resetErrorMessages()

      if (rejectedFiles.length) {
        if (acceptedFiles.length || rejectedFiles.length > 1) {
          const message = 'Only one session at a time may be imported'
          console.error(message)
          setDragErrorMessage(message)
        } else if (rejectedFiles[0].file.size > MAX_FILE_SIZE) {
          const message = `File size is too large (${Math.round(
            rejectedFiles[0].file.size / 1024 ** 2,
          )} MiB), max size is ${MAX_FILE_SIZE / 1024 ** 2} MiB`
          console.error(message)
          setDragErrorMessage(message)
        } else {
          const message = 'Unknown file import error'
          console.error(message)
          setDragErrorMessage(message)
        }
        return
      }

      const [file] = acceptedFiles
      if (file) {
        const fileInfo = determineFileInfo(file.name)
        try {
          /**
           * JSON files are for bulk import of files from the GDC site
           */
          if (fileInfo.format == 'json') {
            const res = await new Promise(resolve => {
              const reader = new FileReader()
              reader.addEventListener('load', event =>
                resolve(JSON.parse(event.target?.result as string)),
              )
              reader.readAsText(file)
            })
            // if the file is json we need to look at the properties to determine how to process it
            const propertyArray = []
            //@ts-expect-error
            for (const property in res.slice(0, 1)[0]) {
              propertyArray.push(property)
            }
            // key properties dictate how a file should be processed and displayed, i.e. the file_id
            if (propertyArray.includes('file_id')) {
              //@ts-expect-error
              const ele = res.slice(0, MAX_FILES) //TODO: it only gets the first 25 files
              ele.map(
                (file: {
                  file_id: string
                  file_name: string
                  data_category: string
                  file_type: string
                }) => {
                  const iterFileInfo = determineFileInfo(file.file_name)
                  const uri = `http://localhost:8010/proxy/data/${file.file_id}`
                  const typeAdapterObject = mapDataInfo(iterFileInfo, uri)
                  addAndShowTrack(
                    typeAdapterObject,
                    file.file_id,
                    file.file_name,
                    'drag',
                  )
                },
              )
            } else {
              const message =
                'Failed to add track.\nThe configuration of this file is not currently supported. Ensure that you have enabled the "File UUID" column on the GDC explore page table before exporting.'
              console.error(message)
              setDragErrorMessage(message)
            }
          } else if (fileInfo.type === 'bedpe') {
            await addBEDPEView(file.name, undefined, file)
            setDragSuccess(true)
          } else {
            // BAM files are a special case w drag and drop that require forcing the user to upload a bai file
            if (/\.bam$/i.test(file.name)) {
              if (!model.indexTrackData) {
                setUploadInfoMessage('Please upload a corresponding BAI file.')
                setFileChip(file.name)
              }
              // @ts-expect-error
              model.setTrackData(storeBlobLocation({ blob: file }))
            }
            if (/\.bai$/i.test(file.name)) {
              if (!model.trackData) {
                setUploadInfoMessage('Please upload a corresponding BAM file.')
                setFileChip(file.name)
              }
              // @ts-expect-error
              model.setIndexTrackData(storeBlobLocation({ blob: file }))
            }
            if (
              (/\.bam$/i.test(file.name) || /\.bai$/i.test(file.name)) &&
              model.indexTrackData &&
              model.trackData
            ) {
              const trackId = `gdc_plugin_track-${Date.now()}`

              //TODO: update this to go through the enahancement 2135 workflow
              const typeAdapterObject = {
                config: {
                  type: 'AlignmentsTrack',
                  adapter: {
                    type: 'BamAdapter',
                    bamLocation: model.trackData,
                    index: {
                      location: model.indexTrackData,
                      indexType: 'BAI',
                    },
                  },
                },
              }
              addAndShowTrack(
                typeAdapterObject,
                trackId,
                // @ts-expect-error
                model.trackData.name as string,
                'drag',
              )
              model.setTrackData(undefined)
              model.setIndexTrackData(undefined)
              setFileChip(undefined)
              setUploadInfoMessage(undefined)
            }
            // all other files go through this channel
            if (!(/\.bam$/i.test(file.name) || /\.bai$/i.test(file.name))) {
              const trackId = `gdc_plugin_track-${Date.now()}`
              const typeAdapterObject = mapDataInfo(
                fileInfo,
                undefined,
                undefined,
                file,
              )
              addAndShowTrack(typeAdapterObject, trackId, file.name, 'drag')
            }
          }
        } catch (e) {
          console.error(e)
          const message =
            // @ts-expect-error
            e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
          setDragErrorMessage(`Failed to add track.\n ${message}.`)
        }
      }
    },
  })

  function processExplorationURI(uri: string, source?: string) {
    const query = uri.split('?')[1]

    const queryParams = new URLSearchParams(query)

    const featureType =
      queryParams.get('searchTableTab') === 'genes' ||
      queryParams.get('searchTableTab') === 'mutations'
        ? // @ts-expect-error
          queryParams.get('searchTableTab').slice(0, -1)
        : 'mutation'
    const filterString = queryParams.get('filters')
      ? queryParams.get('filters')
      : '{}'
    // @ts-expect-error
    const filters = decodeURIComponent(filterString)

    const datenow = Date.now()
    const trackId = `gdc_plugin_track-${datenow}`
    const trackName = `GDC Explore session-${datenow}`
    const typeAdapterObject = mapGDCExploreConfig(
      'GDC Explore',
      featureType,
      filters,
      trackId,
    )

    addAndShowTrack(typeAdapterObject, trackId, trackName, source)
  }

  const handleSubmit = async () => {
    resetErrorMessages()

    try {
      // @ts-expect-error
      let query = inputRef ? inputRef.current.value : undefined

      if (query.includes('exploration')) {
        processExplorationURI(query)
      } else if (!query) {
        setTrackErrorMessage(
          'Failed to add track.\nUUID or URL must be provided.',
        )
      } else {
        if (query.includes('files/')) {
          query = query.split('/')[4]
        }
        const response = await fetchFileInfo(query)
        const fileInfo = {
          category: response.data.data_category,
          format: response.data.data_format.toLowerCase(),
          type: response.data.data_type,
        }
        // BAM files require an index file, if the response contains index_files, then we want to utilize it
        const indexFileId = response.data.index_files
          ? response.data.index_files[0].file_id
          : undefined
        const uri = `http://localhost:8010/proxy/data/${query}`
        const trackId = `${response.data.file_id}`
        const trackName = `${response.data.file_name}`
        if (fileInfo.type !== 'bedpe') {
          const typeAdapterObject = mapDataInfo(fileInfo, uri, indexFileId)
          addAndShowTrack(typeAdapterObject, trackId, trackName)
        } else {
          await addBEDPEView(response.data.file_id, uri)
          setSuccess(true)
        }
      }
    } catch (e) {
      // @ts-expect-error
      if (!e.message.includes('unable to determine size of file at')) {
        console.error(e)
        const message =
          // @ts-expect-error
          e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
        setTrackErrorMessage(`Failed to add track.\n ${message}.`)
      }
    }
    // @ts-expect-error
    inputRef.current.value = null
  }

  const { classes } = useStyles()

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h6" component="h1" align="center">
          Drag and Drop Local GDC Files
        </Typography>
        <div className={classes.dragAndDropContainer}>
          <div {...getRootProps({ className: classes.dropZone })}>
            <input {...getInputProps()} />
            <CloudUploadIcon className={classes.uploadIcon} fontSize="large" />
            <Typography color="textSecondary" align="center" variant="body1">
              Drag and drop files here
            </Typography>
            <Typography color="textSecondary" align="center" variant="body2">
              or
            </Typography>
            <Button color="primary" variant="contained">
              Browse Files
            </Button>
          </div>
          <div className={classes.tipContainer}>
            <Paper className={classes.tipPaper} elevation={0}>
              <div className={classes.tipMessageContainer}>
                <InfoIcon />
                <Typography color="textSecondary" variant="caption">
                  You can bulk import files from the GDC Repository using the
                  JSON export button.
                </Typography>
                <Button
                  variant="text"
                  onClick={() => {
                    session.queueDialog(doneCallback => [
                      TipDialogue,
                      {
                        handleClose: () => {
                          doneCallback()
                        },
                      },
                    ])
                  }}
                >
                  <b>Learn More</b>
                </Button>
              </div>
            </Paper>
          </div>
        </div>
        {dragSuccess ? (
          <Alert severity="success">
            The requested track(s) from the file have been added.
          </Alert>
        ) : null}
        {dragErrorMessage ? (
          <Alert severity="error">{dragErrorMessage}</Alert>
        ) : null}
        {fileChip ? (
          <Chip
            label={fileChip}
            avatar={<InsertDriveFile />}
            onDelete={handleDelete}
          />
        ) : null}
        {uploadInfoMessage ? (
          <Alert severity="info">{uploadInfoMessage}</Alert>
        ) : null}
      </Paper>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h6" component="h1" align="center">
          Import File or Exploration by UUID or URL
        </Typography>
        <Typography variant="body1" align="center">
          Add a track by providing the UUID or URL of a file, including
          controlled data, or by providing the URL of an Exploration session.
        </Typography>
        {trackErrorMessage ? (
          <Alert severity="error">{trackErrorMessage}</Alert>
        ) : null}
        {trackInfoMessage ? (
          <Alert severity="info">{trackInfoMessage}</Alert>
        ) : null}
        {success ? (
          <Alert severity="success">The requested track has been added.</Alert>
        ) : null}
        <div className={classes.submitContainer}>
          <TextField
            color="primary"
            variant="outlined"
            label="Enter UUID or URL"
            inputRef={inputRef}
          />
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
      </Paper>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.typoContainer}>
          <Typography variant="h6" component="h1" align="center">
            Quick-add a GDC Explore Track
          </Typography>
          <Typography variant="body1" align="center">
            Add additional Explore tracks to your current view by clicking this
            button.
          </Typography>
        </div>
        {exploreSuccess ? (
          <Alert severity="success">
            The requested Explore track has been added.
          </Alert>
        ) : null}
        <div className={classes.addTrackButtonContainer}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => {
              processExplorationURI(
                'https://portal.gdc.cancer.gov/exploration?facetTab=mutations',
                'explore',
              )
            }}
          >
            Add New GDC Explore Track
          </Button>
        </div>
      </Paper>
    </div>
  )
}

export default observer(Panel)
