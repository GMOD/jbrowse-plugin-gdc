import { FileDrop } from 'react-file-drop'
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined'
import {
  Typography,
  Link,
  makeStyles,
} from '@material-ui/core'
import GDCFeature from '../GDCAdapter/GDCFeature'

export default jbrowse => {
  const { observer, PropTypes: MobxPropTypes } = jbrowse.jbrequire('mobx-react')
  const PropTypes = jbrowse.jbrequire('prop-types')
  const React = jbrowse.jbrequire('react')
  const { useState, useEffect } = React

  const useStyles = makeStyles(theme => ({
    root: {
      margin: theme.spacing(2),
      fontSize: '1.2em',
    },
    frame: {
      borderRadius: "25px",
      border: 'dashed 2px #311b92',
      textAlign: 'center',
      padding: '20px',
      marginTop: '20px',
    },
    icon: {
      fontSize: '5em'
    }
  }))

  function manipulateJSON(json, model) {
    Array.from(json).forEach(value => {
      var genomicDnaChange = value.genomic_dna_change
      value.chromosome = genomicDnaChange.split(":")[0]
      value.mutationType = "Simple Somatic Mutation"
      value.startPosition = parseInt(genomicDnaChange.split(".")[1].split(">")[0].slice(0, -1))
      value.endPosition = value.startPosition

      value.nciBuild = "GRCh38"
      value.numOfCasesInCohort = 1
      value.occuranceInCohort = 1
      value.percentage = 100
      value.referenceAllele = genomicDnaChange.split(".")[1].split(">")[0].slice(-1)
      value.score = 0

      const idField = 'ssmId'
    })
    

    model.addTrack();
  }

  function isValidFile(file) {
    const validTypes = ['application/json'];
    if (validTypes.indexOf(file.type) === -1) {
        return false;
    }
    return true;
  }

  function handleFiles(files, model) {
    Array.from(files).forEach(file => {
      if (isValidFile(file)) {
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onload = function(e) {
          manipulateJSON(JSON.parse(e.target.result), model)
        }
      }
    });
  }

  function propagateData(e, model) {
    e.preventDefault()
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files, model)
    }
  }
  
  function GDCUploadDialog(props) {
    const { model } = props
    const classes = useStyles()
      
    return (
      <div className={classes.root}>
        <Typography variant="h4" color="primary">
          Upload GDC JSON file
        </Typography>
        <div className={classes.frame}>
          <FileDrop
            onFrameDrop={(event) => propagateData(event, model)}
            onFrameDragEnter={(event) => console.log('change css')}
            onFrameDragLeave={(event) => console.log('change css')}
          >
            <CloudUploadIcon className={classes.icon}/>
            <Typography variant="body1">
              Drag & drop to upload
            </Typography>
            <Typography variant="body1">
              or&nbsp;
              <Link href="#" color="secondary">browse</Link>
            </Typography>
          </FileDrop>
        </div>
      </div>
      )
  }

  GDCUploadDialog.propTypes = {
      model: MobxPropTypes.observableObject.isRequired,
  }

  return observer(GDCUploadDialog)
}