import React, { useState } from 'react'
import { observer } from 'mobx-react'
import {
  Typography,
  MenuItem,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  FormHelperText,
  InputLabel,
  Chip,
} from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { mutationHighlightFeatures, geneHighlightFeatures } from './Utility'

const useStyles = makeStyles()(theme => ({
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
  paper: {
    padding: theme.spacing(2),
  },
}))

/**
 * Render a highlight/colour by element for colouring features
 */
const HighlightFeature = observer(({ schema, type }) => {
  const { classes } = useStyles()

  const [colourBy, setColourBy] = useState(
    Object.keys(schema.getColourBy()).length !== 0
      ? JSON.parse(schema.getColourBy())
      : '',
  )
  const highlightFeatures =
    type === 'mutation' ? mutationHighlightFeatures : geneHighlightFeatures

  const handleChangeHighlightBy = event => {
    const hlBy = event.target.value
    setColourBy(hlBy)
    let colourFunction = ''
    if (hlBy.type === 'threshold') {
      colourFunction = `jexl:get(feature,'${hlBy.attributeName}') >= ${hlBy.values[0].threshold} ? '${hlBy.values[0].colour1}' : '${hlBy.values[0].colour2}'`
    } else if (hlBy.type === 'category') {
      colourFunction = `jexl:switch(feature,'${JSON.stringify(hlBy)}')`
    } else if (hlBy.type === 'boolean') {
      colourFunction = `jexl:cancer(feature,'${hlBy.attributeName}')`
    } else if (hlBy.type === 'percentage') {
      colourFunction = `jexl:rgb(feature,'${hlBy.attributeName}')`
    } else {
      colourFunction = `jexl:cast('goldenrod')`
    }
    // Set to function
    schema.target.displays[0].renderer.color1.set(colourFunction)

    // Set to colour array element
    schema.setColourBy(JSON.stringify(hlBy))
    schema.target.adapter.colourBy.set(JSON.stringify(hlBy))
  }

  return (
    <>
      <Paper className={classes.paper}>
        <Typography variant="h6">Colour Features</Typography>
        <FormControl>
          <InputLabel>Attribute</InputLabel>
          <Select
            labelId="track-type-select-label"
            id="track-type-select"
            value={colourBy}
            onChange={handleChangeHighlightBy}
            renderValue={selected => selected.name}
          >
            {highlightFeatures.map(element => {
              return (
                <MenuItem value={element} key={element.name}>
                  {element.name}
                </MenuItem>
              )
            })}
          </Select>
          <FormHelperText>
            Select how to colour features on the track based on feature
            attributes.
          </FormHelperText>
        </FormControl>
        {colourBy && colourBy.values && (
          <div>
            <Typography variant="subtitle2" className={classes.text}>
              {colourBy.symbol}
            </Typography>
            {colourBy.values && colourBy.type === 'category' && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Corresponding colour</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colourBy.values &&
                    colourBy.values.map(value => {
                      return (
                        <TableRow key={value.name}>
                          <TableCell>
                            {value.name !== '' ? value.name : 'n/a'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour}
                              style={{
                                backgroundColor: value.colour,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}

            {colourBy.values && colourBy.type === 'threshold' && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Threshold</TableCell>
                    <TableCell>Below</TableCell>
                    <TableCell>Equal or Above</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colourBy.values &&
                    colourBy.values.map(value => {
                      return (
                        <TableRow key={value.name}>
                          <TableCell>
                            {value.name !== '' ? value.name : 'n/a'}
                          </TableCell>
                          <TableCell>{value.threshold}</TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour2}
                              style={{
                                backgroundColor: value.colour2,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour1}
                              style={{
                                backgroundColor: value.colour1,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}

            {colourBy.values && colourBy.type === 'boolean' && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>True</TableCell>
                    <TableCell>False</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colourBy.values &&
                    colourBy.values.map(value => {
                      return (
                        <TableRow key={value.name}>
                          <TableCell>
                            {value.name !== '' ? value.name : 'n/a'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour1}
                              style={{
                                backgroundColor: value.colour1,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour2}
                              style={{
                                backgroundColor: value.colour2,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}
            {colourBy.values && colourBy.type === 'percentage' && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Value</TableCell>
                    <TableCell>Low</TableCell>
                    <TableCell>High</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colourBy.values &&
                    colourBy.values.map(value => {
                      return (
                        <TableRow key={value.name}>
                          <TableCell>
                            {value.name !== '' ? value.name : 'n/a'}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour1}
                              style={{
                                backgroundColor: value.colour1,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={value.colour2}
                              style={{
                                backgroundColor: value.colour2,
                                color: 'white',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </Paper>
    </>
  )
})

export default HighlightFeature
