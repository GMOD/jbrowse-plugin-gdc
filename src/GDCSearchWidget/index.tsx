import React from 'react'
import type PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import ImportPanelModel from './model'
import ReactComponent from './ImportPanel'

const GDCSearchWidgetPlugin = (jbrowse: PluginManager) => {
  return {
    configSchema: ConfigurationSchema('GDCSearchWidget', {}),
    ReactComponent,
    stateModel: jbrowse.load(ImportPanelModel),
    HeadingComponent: () => <>GDC Data Import</>,
  }
}

export default GDCSearchWidgetPlugin
