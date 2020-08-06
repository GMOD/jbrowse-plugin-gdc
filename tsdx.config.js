const packageJson = require('./package.json')

depNames = Object
            .keys(packageJson.dependencies)
            .filter(dep => dep !== '@gmod/jbrowse-core')

const globals = [
  'mobx',
  'mobx-state-tree',
  'react',
  'react-dom',
  'mobx-react',
  'prop-types',

  '@material-ui/core',
  '@material-ui/lab',

  '@gmod/jbrowse-core/Plugin',
  '@gmod/jbrowse-core/pluggableElementTypes/ViewType',
  '@gmod/jbrowse-core/pluggableElementTypes/AdapterType',
  '@gmod/jbrowse-core/pluggableElementTypes/TrackType',
  '@gmod/jbrowse-core/pluggableElementTypes/WidgetType',

  '@gmod/jbrowse-core/util/rxjs',

  '@gmod/jbrowse-core/pluggableElementTypes/renderers/ServerSideRendererType',
  '@gmod/jbrowse-core/pluggableElementTypes/renderers/CircularChordRendererType',
  '@gmod/jbrowse-core/pluggableElementTypes/renderers/BoxRendererType',
  '@gmod/jbrowse-core/configuration',
  '@gmod/jbrowse-core/util/types/mst',
  '@gmod/jbrowse-core/ui',
  '@gmod/jbrowse-core/util',
  '@gmod/jbrowse-core/util/color',
  '@gmod/jbrowse-core/util/tracks',
  '@gmod/jbrowse-core/util/Base1DViewModel',
  '@gmod/jbrowse-core/util/io',
  '@gmod/jbrowse-core/util/mst-reflection',
  '@gmod/jbrowse-core/BaseViewModel',
  '@gmod/jbrowse-core/BaseFeatureWidget/BaseFeatureDetail',

  '@gmod/jbrowse-core/data_adapters/BaseAdapter',
]

module.exports = {
  rollup(config, options) {
    if (options.format === 'umd') {
      const originalExternal = config.external
      config.external = (...args) => {
        const id = args[0]
        if (depNames.includes(id)) {
          return false
        } else {
          return originalExternal(...args)
        }
      }
      globals.forEach(global => {
        config.output.globals[global] = `JBrowseExports.${global}`
      })
    };
    return config;
  }
}
