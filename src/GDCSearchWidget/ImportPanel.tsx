import React, { useState, useRef, useEffect } from 'react'
import { observer } from 'mobx-react'
import { FileLocation, getSession } from '@jbrowse/core/util'
import { storeBlobLocation } from '@jbrowse/core/util/tracks'
import {
  Paper,
  Button,
  Typography,
  TextField,
  Chip,
  makeStyles,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import InsertDriveFile from '@material-ui/icons/InsertDriveFile'
import ExitToApp from '@material-ui/icons/ExitToApp'
import AddIcon from '@material-ui/icons/Add'
import InfoIcon from '@material-ui/icons/Info'
import LoginDialogue from './LoginDialogue'
import TipDialogue from './TipDialogue'
import { mapDataInfo, mapGDCExploreConfig } from './GDCDataInfo'

const MAX_FILE_SIZE = 512 * 1024 ** 2 // 512 MiB
const MAX_FILES = 25

//@ts-ignore
function styledBy(property, mapping) {
  // @ts-ignore
  return props => mapping[props[property]]
}

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  fileInput: {
    marginBottom: theme.spacing(2),
  },
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(2),
    margin: `0px 0px ${theme.spacing(1)}px 0px`,
  },
  dragAndDropContainer: {
    margin: `${theme.spacing(2)}px ${theme.spacing(2)}px 0px ${theme.spacing(
      2,
    )}px`,
  },
  dropZone: {
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 2,
    padding: theme.spacing(2),
    // borderColor: styledBy('isDragActive', {
    //   true: theme.palette.secondary.light,
    //   false: theme.palette.divider,
    // }),
    borderStyle: 'dashed',
    // backgroundColor: styledBy('isDragActive', {
    //   true: fade(theme.palette.text.primary, theme.palette.action.hoverOpacity),
    //   false: theme.palette.background.default,
    // }),
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
    marginTop: theme.spacing(4),
  },
  listItem: {
    padding: theme.spacing(0, 4),
  },
  expandIcon: {
    color: '#FFFFFF',
  },
  error: {
    margin: theme.spacing(2),
  },
  errorHeader: {
    background: theme.palette.error.light,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  errorMessage: {
    padding: theme.spacing(2),
  },
  submitContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
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
    paddingTop: theme.spacing(2),
  },
  tipPaper: {
    display: 'flex',
    background: theme.palette.grey[100],
  },
  tipMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(2),
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}))

async function fetchFileInfo(query: any) {
  const response = await fetch(
    `http://localhost:8010/proxy/files/${query}?expand=index_files`,
    {
      method: 'GET',
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch ${response.status} ${response.statusText}`)
  }
  return response.json()
}

const Panel = ({ model }: { model: any }) => {
  const [dragErrorMessage, setDragErrorMessage] = useState<String>()
  const [success, setSuccess] = useState(false)
  const [dragSuccess, setDragSuccess] = useState(false)
  const [exploreSuccess, setExploreSuccess] = useState(false)
  const [tokenStored, setTokenStored] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<String>()
  const [trackInfoMessage, setTrackInfoMessage] = useState<String>()
  const [authErrorMessage, setAuthErrorMessage] = useState<String>()
  const [uploadInfoMessage, setUploadInfoMessage] = useState<String>()
  const [fileChip, setFileChip] = useState<String>()

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
    // @ts-ignore
    session.views[xView].setDisplayName(`GDC BEDPE ${fileUUID}`)
    if (uri) {
      // @ts-ignore
      session.views[xView].importWizard.setFileSource({
        uri,
        locationType: 'UriLocation',
        authHeader: 'X-Auth-Token',
        internetAccountId: 'GDCExternalToken',
      })
    }
    if (fileBlob) {
      // @ts-ignore
      session.views[xView].importWizard.setFileSource(
        storeBlobLocation({ blob: fileBlob }),
      )
    }
    // @ts-ignore
    session.views[xView].importWizard.setFileType('BEDPE')
    // @ts-ignore
    session.views[xView].importWizard.setSelectedAssemblyName('hg38')
    // @ts-ignore
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
      let conf = {
        ...typeAdapterObject.config,
        trackId,
        name,
        assemblyNames: ['hg38'],
      }
      //@ts-ignore
      session.addTrackConf({
        ...conf,
      })
      //@ts-ignore
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
   * helper function to determine the file type of a dragged file. needed because files like BAM and VCF do not
   * have inherent types to extract from the File object. this function needs to be modified whenever new file
   * types are to be supported. files with several extensions can be supported in the future
   * @param fileName the name of the file to determine the extension
   * @returns the type of the file that coordinates with the keys in GDCDataInfo
   */
  function determineFileType(fileName: string) {
    let type = ''
    const fileNameArray = fileName.split('.')

    for (const e of fileNameArray) {
      switch (e) {
        case 'seg':
          type = 'txt-Copy Number Variation'
          break
        case 'vcf':
          type = 'vcf-Simple Nucleotide Variation'
          break
        case 'maf':
          type = 'maf-Simple Nucleotide Variation'
          break
        case 'txt':
          type = 'txt-Transcriptome Profiling'
          break
        case 'json':
          type = 'json'
          break
        case 'bedpe':
          type = 'bedpe'
          break
        default:
          break
      }
    }

    return type
  }

  function resetErrorMessages() {
    setTrackErrorMessage(undefined)
    setTrackInfoMessage(undefined)
    setAuthErrorMessage(undefined)
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
          //@ts-ignore
        } else if (rejectedFiles[0].file.size > MAX_FILE_SIZE) {
          const message = `File size is too large (${Math.round(
            //@ts-ignore
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
        const type = determineFileType(file.name)
        try {
          /**
           * JSON files are for bulk import of files from the GDC site
           */
          if (type == 'json') {
            const res = await new Promise(resolve => {
              const reader = new FileReader()
              reader.addEventListener('load', event =>
                resolve(JSON.parse(event.target?.result as string)),
              )
              reader.readAsText(file)
            })
            // if the file is json we need to look at the properties to determine how to process it
            let propertyArray = []
            //@ts-ignore
            for (const property in res.slice(0, 1)[0]) {
              propertyArray.push(property)
            }
            // key properties dictate how a file should be processed and displayed, i.e. the file_id
            if (propertyArray.includes('file_id')) {
              //@ts-ignore
              const ele = res.slice(0, MAX_FILES) //TODO: it only gets the first 25 files
              ele.map(
                (file: {
                  file_id: string
                  file_name: string
                  data_category: string
                  file_type: string
                }) => {
                  const category = determineFileType(file.file_name)
                  const uri = `http://localhost:8010/proxy/data/${file.file_id}`
                  const typeAdapterObject = mapDataInfo(category, uri)
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
          } else if (type === 'bedpe') {
            await addBEDPEView(file.name, undefined, file)
            setDragSuccess(true)
          } else {
            // BAM files are a special case w drag and drop that require forcing the user to upload a bai file
            if (/\.bam$/i.test(file.name)) {
              if (!model.indexTrackData) {
                setUploadInfoMessage('Please upload a corresponding BAI file.')
                setFileChip(file.name)
              }
              model.setTrackData(storeBlobLocation({ blob: file }))
            }
            if (/\.bai$/i.test(file.name)) {
              if (!model.trackData) {
                setUploadInfoMessage('Please upload a corresponding BAM file.')
                setFileChip(file.name)
              }
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
                model.trackData.name,
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
              //TODO: update this to go through the enhancement 2135 workflow
              const typeAdapterObject = mapDataInfo(
                type,
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
            // @ts-ignore
            e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
          setDragErrorMessage(`Failed to add track.\n ${message}.`)
        }
      }
    },
  })

  function processExplorationURI(uri: string, source?: string) {
    let featureType = uri.split('facetTab=')[1]
    if (featureType !== undefined) {
      featureType = featureType.split('&filters=')[0].slice(0, -1)
    }
    if (
      featureType === 'case' ||
      featureType === 'clinica' ||
      featureType === undefined
    ) {
      setTrackInfoMessage(
        'Configurations to "Cases" and "Clinical" are not currently supported. The requested Explore Track will default to displaying Mutations with your applied filters.',
      )
      featureType = 'mutation'
    }
    let filters = decodeURIComponent(
      uri
        .split('&facetTab=')[0]
        .split('/')[3]
        .split('filters=')[1],
    )

    if (filters == 'undefined') {
      filters = '{}'
    }

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
      // @ts-ignore
      let query = inputRef ? inputRef.current.value : undefined

      if (query.includes('exploration?')) {
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
        if (
          response.data.access == 'controlled' &&
          !window.sessionStorage.getItem('GDCExternalToken-token')
        ) {
          setAuthErrorMessage(
            'Authentication failed.\nPlease enter your token in the GDC Login to access controlled data.',
          )
          setTrackErrorMessage(
            'Failed to add track.\nThis is a controlled resource that requires an authenticated token provided to the GDC Login to access.',
          )
        } else {
          const category = `${response.data.data_format.toLowerCase()}-${
            response.data.data_category
          }`
          // BAM files require an index file, if the response contains index_files, then we want to utilize it
          const indexFileId = response.data.index_files
            ? response.data.index_files[0].file_id
            : undefined
          const uri = `http://localhost:8010/proxy/data/${query}`
          const trackId = `${response.data.file_id}`
          const trackName = `${response.data.file_name}`
          if (category !== 'bedpe-Structural Variation') {
            const typeAdapterObject = mapDataInfo(category, uri, indexFileId)
            addAndShowTrack(typeAdapterObject, trackId, trackName)
          } else {
            await addBEDPEView(response.data.file_id, uri)
            setSuccess(true)
          }
        }
      }
    } catch (e) {
      // @ts-ignore
      if (!e.message.includes('unable to determine size of file at')) {
        console.error(e)
        const message =
          // @ts-ignore
          e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
        setTrackErrorMessage(`Failed to add track.\n ${message}.`)
      }
    }
    // @ts-ignore
    inputRef.current.value = null
  }

  const classes = useStyles({ isDragActive })

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
                    // @ts-ignore
                    session.queueDialog((doneCallback: Function) => [
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
      <Paper className={classes.paper}>
        {tokenStored ? (
          <Alert severity="success">
            Your token has been stored.
            <br />
            Verification of your token will be performed when you attempt to
            access controlled data.
          </Alert>
        ) : null}
        {authErrorMessage ? (
          <Alert severity="error">{authErrorMessage}</Alert>
        ) : null}
        <div className={classes.loginPromptContainer}>
          <div className={classes.typoContainer}>
            <Typography variant="body1">
              Login to access controlled data
            </Typography>
          </div>
          <div className={classes.buttonContainer}>
            <Button
              color="primary"
              variant="contained"
              size="small"
              startIcon={<ExitToApp />}
              onClick={() => {
                // @ts-ignore
                session.queueDialog((doneCallback: Function) => [
                  LoginDialogue,
                  {
                    setTokenStored,
                    setAuthErrorMessage,
                    handleClose: () => {
                      doneCallback()
                    },
                  },
                ])
              }}
            >
              Login
            </Button>
          </div>
        </div>
      </Paper>
      <Paper className={classes.paper}>
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
      <Paper className={classes.paper}>
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
            size="large"
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
