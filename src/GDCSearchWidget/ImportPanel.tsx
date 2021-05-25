import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { Paper, Button, Typography, makeStyles } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ErrorIcon from '@material-ui/icons/Error'

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
}))

const Panel = ({ model }: { model: any }) => {
  const [error, setError] = useState<Error>()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'application/json',
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    onDrop: async (acceptedFiles, rejectedFiles) => {
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
                  height: 12,
                  constraints: { max: 2, min: -2 },
                  rendererTypeNameState: 'density',
                },
              )
            })
          } else {
            const featureType = file.name.includes('mutations') ? 'mutation' : 'gene'
  
            const datenow = Date.now()
            const trackId = `gdc_plugin_track-${datenow}`
            const config = {
              adapter: {
                type: 'GDCJSONAdapter',
                featureType,
                data: JSON.stringify(res)
              },
              assemblyNames: ['hg38'],
              category: undefined,
              displays: [
                {
                  displayId: `gdc_plugin_track_linear-${datenow}`,
                  renderer: {
                    color1: "jexl:cast({LOW: 'blue', MODIFIER: 'goldenrod', MODERATE: 'orange', HIGH: 'red'})[get(feature,'consequence').hits.edges[.node.transcript.is_canonical == true][0].node.transcript.annotation.vep_impact] || 'lightgray'",
                    labels: {
                      name: "jexl:get(feature,'genomicDnaChange')",
                      type: "SvgFeatureRenderer"
                    },
                  },
                  type: "LinearGDCDisplay"
                }
              ],
              name: `GDC-${file.name}`,
              trackId,
              type: 'GDCTrack'
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
          setError(e)
        }
      }
    },
  })
  
  const classes = useStyles({ isDragActive })
  const session = getSession(model)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
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
      </Paper>
      {error ? (
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
            {error}
          </Typography>
        </Paper>
      ) : null}
    </div>
  )
}

export default observer(Panel)
