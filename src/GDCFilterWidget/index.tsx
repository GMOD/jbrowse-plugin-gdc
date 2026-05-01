import React from 'react'
import type PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import stateModel from './model'
import ReactComponent from './components/GDCFilterComponent'

const GDCFilterWidgetPlugin = (jbrowse: PluginManager) => {
  return {
    configSchema: ConfigurationSchema('GDCFilterWidget', {}),
    ReactComponent,
    stateModel: jbrowse.load(stateModel),
    HeadingComponent: () => <>GDC Filters</>,
  }
}

export default GDCFilterWidgetPlugin
