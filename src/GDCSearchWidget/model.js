import { ElementId } from '@jbrowse/core/util/types/mst'

import { types } from 'mobx-state-tree'

export default jbrowse => {
  return types.model('GDCSearchWidget', {
    id: ElementId,
    type: types.literal('GDCSearchWidget'),
  })
}
