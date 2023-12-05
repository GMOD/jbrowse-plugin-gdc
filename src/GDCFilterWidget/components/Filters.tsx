import { v4 as uuidv4 } from 'uuid'
import AddIcon from '@mui/icons-material/Add'
import ClearIcon from '@mui/icons-material/Clear'

import { observer } from 'mobx-react'
import React, { useState } from 'react'

import {
  MenuItem,
  FormControl,
  Button,
  Select,
  Input,
  Checkbox,
  ListItemText,
  IconButton,
  List,
  ListItem,
  Tooltip,
} from '@mui/material'

/**
 * An element representing an individual filter with a category and set of
 * applied values
 */
const Filter = observer((props: any) => {
  const { schema, filterModel, facets } = props

  const [categoryValue, setCategoryValue] = useState(
    filterModel.category
      ? facets.find(f => f.name === filterModel.category)
      : facets[0],
  )
  const [filterValue, setFilterValue] = useState(
    filterModel.filter ? filterModel.filter.split(',') : [],
  )

  /**
   * Converts filter model objects to a GDC filter query and updates the track
   * @param {*} filters Array of filter model objects
   * @param {*} target Track target
   */
  function updateTrack(filters, target) {
    let gdcFilters: Record<string, unknown> = { op: 'and', content: [] }
    if (filters.length > 0) {
      for (const filter of filters) {
        if (filter.filter !== '') {
          gdcFilters.content.push({
            op: 'in',
            content: {
              field: `${filter.type}s.${filter.category}`,
              value: filter.filter.split(','),
            },
          })
        }
      }
    } else {
      gdcFilters = {}
    }
    target.adapter.filters.set(JSON.stringify(gdcFilters))
  }

  const handleFilterDelete = () => {
    schema.deleteFilter(filterModel.id)
    updateTrack(schema.filters, schema.target)
  }

  return (
    <>
      <List>
        <ListItem style={{ gap: '4px' }}>
          <FormControl fullWidth size="small">
            <Select
              labelId="category-select-label"
              id="category-select"
              value={categoryValue}
              onChange={event => {
                setCategoryValue(event.target.value)
                setFilterValue([])
                filterModel.setCategory(event.target.value.name)
              }}
              label="Category"
            >
              {facets.map(filterOption => {
                return (
                  <MenuItem value={filterOption} key={filterOption.name}>
                    {filterOption.prettyName}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={filterValue}
              onChange={event => {
                setFilterValue(event.target.value)
                filterModel.setFilter(event.target.value.join(','))
                updateTrack(schema.filters, schema.target)
              }}
              input={<Input />}
              displayEmpty
              renderValue={selected => {
                if (selected.length === 0) {
                  return <em>Filters</em>
                }

                return selected.join(', ')
              }}
            >
              <MenuItem disabled value="">
                <em>Filters</em>
              </MenuItem>
              {categoryValue.values.map(name => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={filterValue.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title="Remove filter" aria-label="remove" placement="bottom">
            <IconButton aria-label="remove filter" onClick={handleFilterDelete}>
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </ListItem>
      </List>
    </>
  )
})

/**
 * A collection of filters along with a button to add new filters
 */
const FilterList = observer(({ schema, type, facets }: Record<string, any>) => {
  const initialFilterSelection = facets[0].name

  const handleClick = () => {
    schema.addFilter(uuidv4(), initialFilterSelection, type, '')
  }

  return (
    <>
      {schema.filters.map(filterModel => {
        if (filterModel.type === type) {
          return (
            <Filter
              schema={schema}
              {...{ filterModel }}
              key={filterModel.id}
              facets={facets}
            />
          )
        }
        return null
      })}
      <Button variant="outlined" onClick={handleClick} startIcon={<AddIcon />}>
        Add Filter
      </Button>
    </>
  )
})

export default FilterList
