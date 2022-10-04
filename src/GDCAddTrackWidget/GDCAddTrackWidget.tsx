import React, { useEffect, useState } from 'react'
import { Alert, Button, Paper, TextField, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { getSession } from '@jbrowse/core/util'
import { AddTrackModel } from '@jbrowse/plugin-data-management'
import { LocalPathLocation, FileLocation } from '@jbrowse/core/util/types'
import { FileSelector } from '@jbrowse/core/ui'
import { getRoot } from 'mobx-state-tree'

import AddIcon from '@mui/icons-material/Add'
import InfoIcon from '@mui/icons-material/Info'
import TipDialogue from '../GDCSearchWidget/TipDialogue'

const useStyles = makeStyles()((theme) => ({
  paper: {
    margin: theme.spacing(),
    padding: theme.spacing(),
  },
}))

export default function GDCAddTrackWidget({ model }: { model: AddTrackModel }) {
  const { classes } = useStyles()
  const [trackName, setTrackName] = useState(
    model.trackName !== '' ? model.trackName : `myvcf - ${Date.now()}`,
  )

  const session = getSession(model)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rootModel = getRoot<any>(model)

  useEffect(() => {
    setTrackName(model.trackName)
  }, [model.trackData])

  return (
    <>
      <Paper className={classes.paper} elevation={3}>
        <Typography variant="h6" component="h1" align="center">
          Remotely add GDC Exploration tracks and files to your current JBrowse
          view
        </Typography>
        <p>
          Add a track by selecting a local file, by providing the UUID or URL of
          a file, including controlled data, or by providing the URL of an
          Exploration session.
        </p>
        <FileSelector
          name=""
          location={model.trackData}
          setLocation={model.setTrackData}
          setName={model.setTrackName}
          rootModel={rootModel}
        />
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={() => {
            session.notify('The requested track has been added.', 'success')
          }}
        >
          Submit
        </Button>
        <Paper elevation={0}>
          {' '}
          {/* tip paper tip Message container */}
          <div>
            <InfoIcon />
            <Typography color="textSecondary" variant="caption">
              You can bulk import files from the GDC Repository using the JSON
              export button.
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
      </Paper>

      <Paper
        className={classes.paper}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
        elevation={3}
      >
        <Typography variant="h6" component="h1" align="center">
          Quick-add a GDC Explore Track
        </Typography>
        <Typography variant="body1" align="center">
          Add additional Explore tracks to your current view by clicking this
          button.
        </Typography>
        <Button
          color="primary"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => {
            // processExplorationURI(
            //   'https://portal.gdc.cancer.gov/exploration',
            // )
            session.notify(
              'The requested Explore track has been added.',
              'success',
            )
          }}
        >
          Add New GDC Explore Track
        </Button>
      </Paper>
    </>
  )
}
