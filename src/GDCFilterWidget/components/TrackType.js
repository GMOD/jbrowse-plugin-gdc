import React from 'react'
import { observer } from 'mobx-react'
import {
  Typography,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
  Paper,
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'

import HelpIcon from '@mui/icons-material/Help'

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
}))

/**
 * A component for changing the track type
 */
export default observer((schema) => {
  const { classes } = useStyles()
  const [trackType, setTrackType] = React.useState(
    schema.schema.target.adapter.featureType.value,
  )

  const handleChange = (event) => {
    setTrackType(event.target.value)
    schema.schema.target.adapter.featureType.set(event.target.value)

    // Set to function
    schema.schema.target.displays[0].renderer.color1.set(
      `jexl:cast('goldenrod')`,
    )

    // Set to colour array element
    schema.schema.setColourBy('{}')
    schema.schema.target.adapter.colourBy.set('{}')
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6">Track Type</Typography>
        <FormControl size="small">
          <Select
            labelId="track-type-select-label"
            id="track-type-select"
            value={trackType}
            onChange={handleChange}
          >
            <MenuItem value="mutation">Mutation</MenuItem>
            <MenuItem value="gene">Gene</MenuItem>
          </Select>
          <FormHelperText>
            Select what to retrieve from the GDC with your selected filters.
          </FormHelperText>
        </FormControl>
      </Paper>
    </div>
  )
})
