import { ConfigurationReference } from '@gmod/jbrowse-core/configuration'
import { getParentRenderProps } from '@gmod/jbrowse-core/util/tracks'
import { getSession } from '@gmod/jbrowse-core/util'
import FilterListIcon from '@material-ui/icons/FilterList'

export default jbrowse => {
  const { types } = jbrowse.jbrequire('mobx-state-tree')

  const configSchema = jbrowse.jbrequire(require('./configSchema'))

  const { blockBasedTrackModel, BlockBasedTrack } = jbrowse.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports

  return types
    .compose(
      'GDCTrack',
      blockBasedTrackModel,
      types.model({
        type: types.literal('GDCTrack'),
        configuration: ConfigurationReference(configSchema),
        height: 100,
      }),
    )

    .actions(self => ({
      openFilterConfig() {
        const session = getSession(self)
        const editor = session.addWidget(
          'GDCFilterWidget',
          'gdcFilter',
          { target: self.configuration },
        )
        session.showWidget(editor)
      },

      selectFeature(feature) {
        const session = getSession(self)
        const featureWidget = session.addWidget(
          'GDCFeatureWidget',
          'gdcFeature',
          { featureData: feature.toJSON() },
        )
        session.showWidget(featureWidget)
        session.setSelection(feature)
      },
    }))

    .views(self => ({
      get renderProps() {
        return {
          ...self.composedRenderProps,
          ...getParentRenderProps(self),
          config: self.configuration.renderer,
        }
      },

      get rendererTypeName() {
        return self.configuration.renderer.type
      },

      get menuOptions() {
        return [
          {
            label: 'Filter',
            onClick: self.openFilterConfig,
            icon: FilterListIcon,
          },
        ]
      },
    }))
    .volatile(() => ({
      ReactComponent: BlockBasedTrack,
    }))
}
