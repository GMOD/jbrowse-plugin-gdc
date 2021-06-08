import React from 'react'
import { observer } from 'mobx-react'
import {
  makeStyles,
  Typography,
  MenuItem,
  FormControl,
  Select,
  List,
  ListItem,
  Tooltip,
} from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 3, 1, 1),
    background: theme.palette.background.default,
    overflowX: 'hidden',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  text: {
    display: 'flex',
    alignItems: 'center',
  },
}))

/**
 * A component for changing the track type
 */
export default observer(schema => {
  const classes = useStyles()
  const [trackType, setTrackType] = React.useState(
    schema.schema.target.adapter.featureType.value,
  )

  const handleChange = event => {
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
    <>
      <Typography variant="h6" className={classes.text}>
        Track Type
        <Tooltip
          title="Set the type of features to grab from the GDC portal"
          aria-label="help"
          placement="right"
        >
          <HelpIcon />
        </Tooltip>
      </Typography>
      <List>
        <ListItem>
          <FormControl className={classes.formControl}>
            <Select
              labelId="track-type-select-label"
              id="track-type-select"
              value={trackType}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Track type</em>
              </MenuItem>
              <MenuItem value="mutation">Mutation</MenuItem>
              <MenuItem value="gene">Gene</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      </List>
    </>
  )
})
