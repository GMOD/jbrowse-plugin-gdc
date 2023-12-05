import React from 'react'
import { Button, DialogContent, Typography, Paper } from '@mui/material'
import { Dialog } from '@jbrowse/core/ui'
import { makeStyles } from 'tss-react/mui'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const THEME_SPACING_A = 8 // theme.spacing(2)
const THEME_SPACING_B = 6 // theme.spacing(1)

const useStyles = makeStyles()(theme => ({
  closeButton: {
    position: 'absolute',
    left: '80px',
    color: theme.palette.grey[500],
  },
  root: {
    margin: THEME_SPACING_B,
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: THEME_SPACING_A,
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
    paddingTop: THEME_SPACING_A,
    paddingBottom: THEME_SPACING_A,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: THEME_SPACING_A,
    alignItems: 'center',
    background: theme.palette.grey[100],
    padding: THEME_SPACING_B,
    marginTop: THEME_SPACING_A,
    marginBottom: THEME_SPACING_A,
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
  const { classes } = useStyles()

  return (
    <Dialog
      open
      onClose={handleClose}
      maxWidth="sm"
      title="How to upload bulk files from the GDC to JBrowse"
    >
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
                  Enable column for &apos;File UUID&apos;
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
