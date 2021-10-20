import React from 'react'
import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import ImportPanelModel from './model'
import ReactComponent from './ImportPanel'

export default (jbrowse: PluginManager) => {
  return {
    configSchema: ConfigurationSchema('GDCSearchWidget', {}),
    ReactComponent,
    stateModel: jbrowse.load(ImportPanelModel),
    HeadingComponent: () => <>GDC Data Import</>,
  }
}
