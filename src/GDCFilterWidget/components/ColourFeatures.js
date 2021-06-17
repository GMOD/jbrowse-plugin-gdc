import React, { useState } from 'react'
import { observer } from 'mobx-react'
import {
  makeStyles,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import HelpIcon from '@material-ui/icons/Help'
import { mutationHighlightFeatures, geneHighlightFeatures } from './Utility'

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
 * Render a highlight/colour by element for colouring features
 */
const HighlightFeature = observer(({ schema, type }) => {
  const classes = useStyles()
  const [colourBy, setColourBy] = useState(schema.getColourBy())
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
      colourFunction = `jexl:cast([get(feature,'${hlBy.attributeName}')] ? '${hlBy.values[0].colour1}' : '${hlBy.values[0].colour2}')`
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
      <Typography variant="h6" className={classes.text}>
        Colour Features
        <Tooltip
          title="Colour features on track based on feature attributes"
          aria-label="help"
          placement="right"
        >
          <HelpIcon />
        </Tooltip>
      </Typography>
      <FormControl className={classes.formControl}>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={colourBy}
          onChange={handleChangeHighlightBy}
        >
          <MenuItem disabled value="">
            <em>Attribute</em>
          </MenuItem>
          {highlightFeatures.map(element => {
            return (
              <MenuItem value={element} key={element.name}>
                {element.name}
              </MenuItem>
            )
          })}
        </Select>
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
                  <TableCell>Colour</TableCell>
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
                        <TableCell>{value.colour}</TableCell>
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
                        <TableCell>{value.colour2}</TableCell>
                        <TableCell>{value.colour1}</TableCell>
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
                        <TableCell>{value.colour1}</TableCell>
                        <TableCell>{value.colour2}</TableCell>
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
                        <TableCell>{value.colour1}</TableCell>
                        <TableCell>{value.colour2}</TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          )}
        </div>
      )}
    </>
  )
})

export default HighlightFeature
