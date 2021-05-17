import React from 'react'
import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'
import stateModel from './model'
import ReactComponent from './ImportPanel'

export default (jbrowse: PluginManager) => {
  return {
    configSchema: ConfigurationSchema('GDCSearchWidget', {}),
    ReactComponent,
    stateModel: jbrowse.load(stateModel),
    HeadingComponent: () => <>GDC Data import</>,
  }
}
