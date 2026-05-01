import { ElementId } from '@jbrowse/core/util/types/mst'
import type PluginManager from '@jbrowse/core/PluginManager'
import type { IAnyStateTreeNode } from '@jbrowse/mobx-state-tree'
import { types } from '@jbrowse/mobx-state-tree'

const Filter = types
  .model({
    id: types.identifier,
    category: types.string,
    type: types.string,
    filter: types.string,
  })
  .actions(self => ({
    setCategory(newCategory: string) {
      self.category = newCategory
      self.filter = ''
    },
    setFilter(newFilter: string) {
      self.filter = newFilter
    },
  }))

const ColourBy = types.model({
  id: types.identifier,
  value: types.string,
})

export default function f(jbrowse: PluginManager) {
  return types
    .model('GDCFilterWidget', {
      id: ElementId,
      type: types.literal('GDCFilterWidget'),
      target: types.safeReference(jbrowse.pluggableConfigSchemaType('track')),
      filters: types.array(Filter),
      colourBy: types.map(ColourBy),
    })
    .actions(self => ({
      setTarget(newTarget: IAnyStateTreeNode) {
        self.target = newTarget
      },
      addFilter(id: string, category: string, type: string, filter: string) {
        self.filters.push(Filter.create({ id, category, type, filter }))
      },
      deleteFilter(id: string) {
        const pos = self.filters.findIndex(filter => filter.id === id)
        const item = self.filters[pos]
        if (item !== undefined) {
          self.filters.remove(item)
        }
      },
      getFiltersByType(type: string) {
        return self.filters.filter(filter => filter.type === type)
      },
      clearFilters() {
        // Keep filters that have been added but not set
        self.filters.replace(self.filters.filter(f => f.filter.length === 0))
      },
      setColourBy(newColourBy: unknown) {
        self.colourBy.set('0', newColourBy as never)
      },
      getColourBy() {
        return self.colourBy.get('0') ?? {}
      },
    }))
}
