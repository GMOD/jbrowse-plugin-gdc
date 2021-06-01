import { ElementId } from '@jbrowse/core/util/types/mst'

import { types } from 'mobx-state-tree'

export default jbrowse => {
  return types.model('GDCLoginWidget', {
    id: ElementId,
    type: types.literal('GDCLoginWidget'),
  })
}
