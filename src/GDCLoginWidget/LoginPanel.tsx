import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { Paper, Button, TextField, Typography, makeStyles } from '@material-ui/core'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ErrorIcon from '@material-ui/icons/Error'
import { containerSizesSelector } from '@material-ui/data-grid'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2)
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
    paddingBottom: theme.spacing(2)
  },
  submitTokenContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  loginSubmissionContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingRight: theme.spacing(2)
  }
}))

const Panel = ({ model }: { model: any }) => {
  const [ error, setError ] = useState<Error>()
  const classes = useStyles()
  const session = getSession(model)

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.imgContainer}>
          <img className={classes.img} src="https://me-pedia.org/images/2/2b/NIH_logo.png"></img>
        </div>
        <div className={classes.helperTextContainer}>
          <Typography variant="h6" component="h1" align="center">
            Login to access controlled data
          </Typography>
          <Typography variant="body1" align="center">
            An authentication token is required to access controlled data.
          </Typography>
          <Typography variant="body2" align="center">
            You will need to provide your authentication token every time you start a new session, as the token is deleted when the session expires.
          </Typography>
        </div>
        <div className={classes.submitTokenContainer}>
          <TextField color="primary" variant="outlined" label="Enter token"/>
          <div className={classes.loginSubmissionContainer}>
            {/* { error ? ( */}
              <div className={classes.errorContainer}>
                <Typography variant="body2">
                  An example of an error message
                </Typography>
              </div>
            {/* ) : null } */}
            <Button color="primary" variant="contained" size="large">
              Login
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default observer(Panel)
