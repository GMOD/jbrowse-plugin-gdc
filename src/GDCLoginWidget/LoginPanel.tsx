import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { Paper, Button, TextField, Typography, makeStyles } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  alertContainer: {
    paddingBottom: theme.spacing(2)
  }
}))

const Panel = ({ model }: { model: any }) => {
  const [ error, setError ] = useState<Error>()
  const [ success, setSuccess ] = useState(false)
  const inputRef = useRef()
  const classes = useStyles()
  const session = getSession(model)

  const handleLogin = () => {
    //@ts-ignore
    const token = inputRef ? inputRef.current.value : ''
    window.sessionStorage.setItem('GDCToken', token)

    setSuccess(true)
  }

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
            { error ? (
              <div className={classes.alertContainer}>
                <Alert severity="error">Authentication failed.<br/>Please verify your token and try again.</Alert>
              </div>
            ) : null }
            { success ? (
              <div className={classes.alertContainer}>
                <Alert severity="success">Your token has been stored.<br/>Verification of your token will be performed when you attempt to access controlled data.</Alert>
              </div>
            ) : null }
          <TextField color="primary" variant="outlined" label="Enter token" inputRef={inputRef}/>
          <div className={classes.buttonContainer}>
            <Button color="primary" variant="contained" size="large" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default observer(Panel)
