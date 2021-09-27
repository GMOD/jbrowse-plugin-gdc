import React from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Paper,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
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
    maxWidth: '100%',
    maxHeight: '100%',
    verticalAlign: 'middle',
  },
  helperTextContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(2),
    alignItems: 'center',
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}))

export default function TipDialogue({
  handleClose,
}: {
  handleClose: () => void
}) {
  const classes = useStyles()

  var items = [
    {
      name: 'Random Name #1',
      description: 'Probably the most random thing you have ever seen!',
    },
    {
      name: 'Random Name #2',
      description: 'Hello World!',
    },
  ]

  return (
    <Dialog open onClose={handleClose} maxWidth="sm">
      <DialogTitle>
        How to upload bulk files from the GDC to JBrowse
        <IconButton
          className={classes.closeButton}
          onClick={() => handleClose()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={classes.root}>
          <div className={classes.paper}>
            <div className={classes.imgContainer}>
              <img
                className={classes.img}
                src="https://i.imgur.com/jCKe4of.png"
              ></img>
            </div>
            <Paper className={classes.textContainer} elevation={0}>
              <div className={classes.helperTextContainer}>
                <Typography variant="body1" align="center">
                  <b>Step 1</b>
                </Typography>
                <Typography variant="body2" align="center">
                  Perform a query on the GDC
                </Typography>
              </div>
              <ArrowForwardIcon />
              <div className={classes.helperTextContainer}>
                <Typography variant="body1" align="center">
                  <b>Step 2</b>
                </Typography>
                <Typography variant="body2" align="center">
                  Enable column for 'File UUID'
                </Typography>
              </div>
              <ArrowForwardIcon />
              <div className={classes.helperTextContainer}>
                <Typography variant="body1" align="center">
                  <b>Step 3</b>
                </Typography>
                <Typography variant="body2" align="center">
                  Click JSON button to Export
                </Typography>
              </div>
              <ArrowForwardIcon />
              <div className={classes.helperTextContainer}>
                <Typography variant="body1" align="center">
                  <b>Step 4</b>
                </Typography>
                <Typography variant="body2" align="center">
                  Drop JSON file into the GDC Widget on JBrowse
                </Typography>
              </div>
            </Paper>
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
