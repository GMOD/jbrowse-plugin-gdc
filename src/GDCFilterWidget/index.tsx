import PluginManager from '@jbrowse/core/PluginManager'
import stateModel from './model'
import GDCFilterComponentF from './components/GDCFilterComponent'

export default (jbrowse: PluginManager) => {
  const React = jbrowse.lib.react

  const ReactComponent = jbrowse.load(GDCFilterComponentF)
  const { ConfigurationSchema } = jbrowse.lib[
    '@jbrowse/core/configuration'
  ]

  const { observer } = jbrowse.lib['mobx-react']

  return {
    configSchema: ConfigurationSchema('GDCFilterWidget', {}),
    ReactComponent,
    stateModel: jbrowse.load(stateModel),
    HeadingComponent: observer(() => {
      return <>GDC Filters</>
    }),
  }
}
