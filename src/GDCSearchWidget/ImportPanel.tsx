import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { FileLocation, getSession } from '@jbrowse/core/util'
import {
  Paper,
  Button,
  Typography,
  TextField,
  makeStyles,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ErrorIcon from '@material-ui/icons/Error'
import ExitToApp from '@material-ui/icons/ExitToApp'
import LoginDialogue from './LoginDialogue'
import { mapDataInfo, mapGDCExploreConfig } from './GDCDataInfo'

const MAX_FILE_SIZE = 512 * 1024 ** 2 // 512 MiB

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
    padding: theme.spacing(2),
    margin: `0px 0px ${theme.spacing(1)}px 0px`,
  },
  dropZone: {
    textAlign: 'center',
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderWidth: 2,
    borderRadius: 2,
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
  alertContainer: {
    padding: `${theme.spacing(2)}px 0px ${theme.spacing(2)}px 0px`,
  },
  loginPromptContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  typoContainer: {
    width: '100%',
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
  const [tokenStored, setTokenStored] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<String>()
  const [authErrorMessage, setAuthErrorMessage] = useState<String>()

  const session = getSession(model)
  const inputRef = useRef()

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
    isFile?: boolean,
  ) {
    if (typeAdapterObject) {
      let conf = {
        ...typeAdapterObject.config,
        trackId,
        //@ts-ignore
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
      if (isFile) {
        setDragSuccess(true)
      } else {
        setSuccess(true)
      }
    } else {
      if (isFile) {
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
          type = 'Copy Number Variation'
          break
        case 'vcf':
          type = 'Simple Nucleotide Variation'
          break
        case 'json':
          type = 'json'
          break
        default:
          break
      }
    }

    return type
  }

  function resetErrorMessages() {
    setTrackErrorMessage(undefined)
    setAuthErrorMessage(undefined)
    setDragErrorMessage(undefined)
    setSuccess(false)
    setDragSuccess(false)
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

            // key properties dictate how a file should be processed and displayed
            if (propertyArray.includes('file_id')) {
              //@ts-ignore
              const ele = res.slice(0, 25)
              ele.map(
                (file: {
                  file_id: string
                  file_name: string
                  data_category: string
                }) => {
                  const category = file.data_category
                  const uri = `https://api.gdc.cancer.gov/data/${file.file_id}`
                  const typeAdapterObject = mapDataInfo(category, uri)
                  addAndShowTrack(
                    typeAdapterObject,
                    file.file_id,
                    file.file_name,
                    true,
                  )
                },
              )
            } else if (
              propertyArray.includes('gene_id') ||
              propertyArray.includes('ssm_id')
            ) {
              const featureType = propertyArray.includes('ssm_id')
                ? 'mutation'
                : 'gene'

              const trackId = `gdc_plugin_track-${Date.now()}`

              const typeAdapterObject = mapGDCExploreConfig(
                'SSM or Gene',
                featureType,
                JSON.stringify(res),
              )
              addAndShowTrack(typeAdapterObject, trackId, file.name, true)
            } else {
              const message =
                'Failed to add track.\nThe configuration of this file is not currently supported.'
              console.error(message)
              setDragErrorMessage(message)
            }
          } else {
            const res = await new Promise(resolve => {
              const reader = new FileReader()
              reader.addEventListener('load', event =>
                resolve(event.target?.result as string),
              )
              reader.readAsDataURL(file)
            })
            const trackId = `gdc_plugin_track-${Date.now()}`
            const typeAdapterObject = mapDataInfo(type, res)
            addAndShowTrack(typeAdapterObject, trackId, file.name, true)
          }
        } catch (e) {
          console.error(e)
          setDragErrorMessage(e.message)
        }
      }
    },
  })

  const handleSubmit = async () => {
    resetErrorMessages()

    try {
      // @ts-ignore
      let query = inputRef ? inputRef.current.value : undefined

      if (query.includes('exploration?')) {
        // @ts-ignore
        let uri = inputRef ? inputRef.current.value : undefined
        const featureType = uri.split('searchTableTab=')[1].slice(0, -1)
        if (featureType != 'case') {
          const filters = decodeURIComponent(
            uri
              .split('&searchTableTab=')[0]
              .split('/')[3]
              .split('filters=')[1],
          )

          const typeAdapterObject = mapGDCExploreConfig(
            'GDC Explore',
            featureType,
            filters,
          )

          const datenow = Date.now()
          const trackId = `gdc_plugin_track-${datenow}`
          const trackName = `GDC-${datenow}`
          addAndShowTrack(typeAdapterObject, trackId, trackName)
        } else {
          setTrackErrorMessage(
            'Failed to add track.\nConfiguration to "cases" is not currently supported.',
          )
        }
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
          !window.sessionStorage.getItem('GDCToken')
        ) {
          setAuthErrorMessage(
            'Authentication failed.\nPlease enter your token in the GDC Login to access controlled data.',
          )
          setTrackErrorMessage(
            'Failed to add track.\nThis is a controlled resource that requires an authenticated token provided to the GDC Login to access.',
          )
        } else {
          const category = response.data.data_category
          // BAM files require an index file, if the response contains index_files, then we want to utilize it
          const indexFileId = response.data.index_files
            ? response.data.index_files[0].file_id
            : undefined

          const uri = `http://localhost:8010/proxy/data/${query}`

          const trackId = `${response.data.file_id}`

          const trackName = `${response.data.file_name}`

          const typeAdapterObject = mapDataInfo(category, uri, indexFileId)

          addAndShowTrack(typeAdapterObject, trackId, trackName)
        }
      }
    } catch (e) {
      console.error(e)
      const message =
        e.message.length > 100 ? `${e.message.substring(0, 99)}...` : e
      setTrackErrorMessage(`Failed to add track.\n ${message}.`)
    }
  }

  const classes = useStyles({ isDragActive })

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6" component="h1" align="center">
          Drag and Drop Local GDC Files
        </Typography>
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
        {dragSuccess ? (
          <div className={classes.alertContainer}>
            <Alert severity="success">
              The requested track(s) from the file have been added.
            </Alert>
          </div>
        ) : null}
        {dragErrorMessage ? (
          <div className={classes.alertContainer}>
            <Alert severity="error">{dragErrorMessage}</Alert>
          </div>
        ) : null}
      </Paper>
      <Paper className={classes.paper}>
        {tokenStored ? (
          <div className={classes.alertContainer}>
            <Alert severity="success">
              Your token has been stored.
              <br />
              Verification of your token will be performed when you attempt to
              access controlled data.
            </Alert>
          </div>
        ) : null}
        {authErrorMessage ? (
          <div className={classes.alertContainer}>
            <Alert severity="error">{authErrorMessage}</Alert>
          </div>
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
                session.setDialogComponent(LoginDialogue, {
                  setTokenStored,
                  setAuthErrorMessage,
                })
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
        <div className={classes.submitContainer}>
          {trackErrorMessage ? (
            <div className={classes.alertContainer}>
              <Alert severity="error">{trackErrorMessage}</Alert>
            </div>
          ) : null}
          {success ? (
            <div className={classes.alertContainer}>
              <Alert severity="success">
                The requested track has been added.
              </Alert>
            </div>
          ) : null}
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
    </div>
  )
}

export default observer(Panel)
