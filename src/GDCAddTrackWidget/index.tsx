import PluginManager from '@jbrowse/core/PluginManager'
import { AddTrackWorkflowType } from '@jbrowse/core/pluggableElementTypes'
import { types } from 'mobx-state-tree'

// import stateModelFactory from './model'

// locals
import GDCAddTrackWidget from './GDCAddTrackWidget'

export default (pm: PluginManager) => {
  pm.addAddTrackWorkflowType(
    () =>
      new AddTrackWorkflowType({
        name: 'Add GDC Data',
        ReactComponent: GDCAddTrackWidget,
        stateModel: types.model({}),
        // stateModel: stateModelFactory(pm),
      }),
  )
}
