import React, { useState } from 'react'
import { Button, DialogContent, TextField, Typography } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Dialog } from '@jbrowse/core/ui'

const useStyles = makeStyles()(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: 100,
    maxWidth: '100%',
    maxHeight: '100%',
    verticalAlign: 'middle',
  },
  helperTextContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  submitTokenContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  alertContainer: {
    paddingBottom: theme.spacing(2),
  },
}))

export default function LoginDialogue({
  handleClose,
}: {
  handleClose: (arg?: string) => void
}) {
  const [token, setToken] = useState('')
  const { classes } = useStyles()

  return (
    <Dialog
      open
      onClose={() => handleClose()}
      maxWidth="sm"
      title="Login to access controlled GDC data"
    >
      <DialogContent>
        <div className={classes.root}>
          <div className={classes.paper}>
            <Typography variant="h4" align="center">
              GDC Data Portal
            </Typography>
            <div className={classes.helperTextContainer}>
              <Typography variant="h6" component="h1" align="center">
                Login to access controlled data
              </Typography>
              <Typography variant="body1" align="center">
                An authentication token is required to access controlled data.
              </Typography>
              <Typography variant="body2" align="center">
                You will need to provide your authentication token every time
                you start a new session, as the token is deleted when the
                session expires.
              </Typography>
            </div>
            <div className={classes.submitTokenContainer}>
              <TextField
                color="primary"
                variant="outlined"
                label="Enter token"
                onChange={event => {
                  setToken(event.target.value)
                }}
              />
              <div className={classes.buttonContainer}>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={() => {
                    handleClose(token)
                  }}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
