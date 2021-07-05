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
import { mapDataInfo } from './GDCDataInfo'

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
  const [dragError, setDragError] = useState<Error>()
  const [success, setSuccess] = useState(false)
  const [tokenStored, setTokenStored] = useState(false)
  const [trackErrorMessage, setTrackErrorMessage] = useState<String>()
  const [authErrorMessage, setAuthErrorMessage] = useState<String>()

  const session = getSession(model)
  const inputRef = useRef()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/json',
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        if (acceptedFiles.length || rejectedFiles.length > 1) {
          const message = 'Only one session at a time may be imported'
          console.error(message)
          setDragError(new Error(message))
          //@ts-ignore
        } else if (rejectedFiles[0].file.size > MAX_FILE_SIZE) {
          const message = `File size is too large (${Math.round(
            //@ts-ignore
            rejectedFiles[0].file.size / 1024 ** 2,
          )} MiB), max size is ${MAX_FILE_SIZE / 1024 ** 2} MiB`
          console.error(message)
          setDragError(new Error(message))
          //@ts-ignore
        } else if (rejectedFiles[0].file.type !== 'application/json') {
          const message = 'File does not appear to be JSON'
          console.error(message)
          setDragError(new Error(message))
        } else {
          const message = 'Unknown file import error'
          console.error(message)
          setDragError(new Error(message))
        }
        return
      }

      const [file] = acceptedFiles
      if (file) {
        try {
          const res = await new Promise(resolve => {
            const reader = new FileReader()
            reader.addEventListener('load', event =>
              resolve(JSON.parse(event.target?.result as string)),
            )
            reader.readAsText(file)
          })

          // processing determined by the file name for now
          if (file.name.includes('files')) {
            //@ts-ignore
            const t = res.slice(0, 5)
            t.map((file: { file_id: string; file_name: string }) => {
              //@ts-ignore
              session.addTrackConf({
                type: 'QuantitativeTrack',
                trackId: file.file_id,
                name: file.file_name,
                assemblyNames: ['hg38'],
                adapter: {
                  type: 'SegmentCNVAdapter',
                  segLocation: {
                    uri: 'https://api.gdc.cancer.gov/data/' + file.file_id,
                  },
                },
              })
              //@ts-ignore
              session.views[0].showTrack(
                file.file_id,
                {},
                {
                  height: 200,
                  constraints: { max: 2, min: -2 },
                  rendererTypeNameState: 'density',
                },
              )
            })
          } else {
            const featureType = file.name.includes('mutations')
              ? 'mutation'
              : 'gene'

            const datenow = Date.now()
            const trackId = `gdc_plugin_track-${datenow}`
            const color1 =
              featureType == 'mutation'
                ? "jexl:cast({LOW: 'blue', MODIFIER: 'goldenrod', MODERATE: 'orange', HIGH: 'red'})[get(feature,'consequence').hits.edges[.node.transcript.is_canonical == true][0].node.transcript.annotation.vep_impact] || 'lightgray'"
                : "jexl:cast('goldenrod')"
            const config = {
              adapter: {
                type: 'GDCJSONAdapter',
                featureType,
                data: JSON.stringify(res),
              },
              assemblyNames: ['hg38'],
              category: undefined,
              displays: [
                {
                  displayId: `gdc_plugin_track_linear-${datenow}`,
                  renderer: {
                    color1,
                    labels: {
                      name: "jexl:get(feature,'genomicDnaChange')",
                      type: 'SvgFeatureRenderer',
                    },
                  },
                  type: 'LinearGDCDisplay',
                },
              ],
              name: `GDC-${file.name}`,
              trackId,
              type: 'GDCTrack',
            }
            //@ts-ignore
            session.addTrackConf({
              ...config,
            })
            //@ts-ignore
            session.views[0].showTrack(trackId)
          }
        } catch (e) {
          console.error(e)
          setDragError(e)
        }
      }
    },
  })

  const handleSubmit = async () => {
    setTrackErrorMessage(undefined)
    setAuthErrorMessage(undefined)
    setSuccess(false)

    try {
      // @ts-ignore
      let query = inputRef ? inputRef.current.value : undefined

      if (query.includes('files/')) {
        query = query.split('/')[4]
      } else {
        // explore work
        query = undefined
        // @ts-ignore
        let uri = inputRef ? inputRef.current.value : undefined
        const featureType = uri.split('searchTableTab=')[1].slice(0, -1)
        const filters = decodeURIComponent(
          uri
            .split('&searchTableTab=')[0]
            .split('/')[3]
            .split('filters=')[1],
        )

        const datenow = Date.now()
        const trackId = `gdc_plugin_track-${datenow}`
        const color1 =
          featureType == 'mutation'
            ? "jexl:cast({LOW: 'blue', MODIFIER: 'goldenrod', MODERATE: 'orange', HIGH: 'red'})[get(feature,'consequence').hits.edges[.node.transcript.is_canonical == true][0].node.transcript.annotation.vep_impact] || 'lightgray'"
            : "jexl:cast('goldenrod')"
        const config = {
          adapter: {
            type: 'GDCAdapter',
            featureType,
            filters,
          },
          assemblyNames: ['hg38'],
          category: undefined,
          displays: [
            {
              displayId: `gdc_plugin_track_linear-${datenow}`,
              renderer: {
                color1,
                labels: {
                  name: "jexl:get(feature,'genomicDnaChange')",
                  type: 'SvgFeatureRenderer',
                },
              },
              type: 'LinearGDCDisplay',
            },
          ],
          name: `GDC-plugin-track-${datenow}`,
          trackId,
          type: 'GDCTrack',
        }

        // @ts-ignore
        session.addTrackConf({
          ...config,
        })
        // @ts-ignore
        session.views[0].showTrack(trackId)
      }

      if (query) {
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

          const typeAdapterObject = mapDataInfo(category, uri, indexFileId)

          if (typeAdapterObject) {
            let conf = {
              trackId,
              //@ts-ignore
              type: typeAdapterObject.config.type,
              name: `${response.data.file_name}`,
              assemblyNames: ['hg38'],
              adapter: {
                //@ts-ignore
                ...typeAdapterObject.config.adapter,
              },
            }

            //@ts-ignore
            session.addTrackConf({
              ...conf,
            })
            //@ts-ignore
            session.views[0].showTrack(trackId)

            setSuccess(true)
          } else {
            setTrackErrorMessage(
              'Failed to add track.\nThe configuration of this file is not currently supported.',
            )
          }
        }
      } else {
        setTrackErrorMessage(
          'Failed to add track.\nUUID or URL must be provided.',
        )
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
        {dragError ? (
          <Paper className={classes.error}>
            <div className={classes.errorHeader}>
              <ErrorIcon color="inherit" fontSize="large" />
              <div>
                <Typography variant="h6" color="inherit" align="center">
                  Import error
                </Typography>
              </div>
            </div>
            <Typography className={classes.errorMessage}>
              {dragError}
            </Typography>
          </Paper>
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
