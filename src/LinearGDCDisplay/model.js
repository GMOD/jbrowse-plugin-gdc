import { ConfigurationReference } from '@jbrowse/core/configuration'
import { getParentRenderProps } from '@jbrowse/core/util/tracks'
import { getSession } from '@jbrowse/core/util'
import FilterListIcon from '@material-ui/icons/FilterList'
import configSchemaF from './configSchema'
import { types } from 'mobx-state-tree'

export default jbrowse => {
  const configSchema = jbrowse.jbrequire(configSchemaF)

  const { BaseLinearDisplay } = jbrowse.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports

  return types
    .compose(
      'LinearGDCDisplay',
      BaseLinearDisplay,
      types.model({
        type: types.literal('LinearGDCDisplay'),
        configuration: ConfigurationReference(configSchema),
      }),
    )

    .actions(self => ({
      openFilterConfig() {
        const session = getSession(self)
        const editor = session.addWidget('GDCFilterWidget', 'gdcFilter', {
          target: self.parentTrack.configuration,
        })
        session.showWidget(editor)
      },

      selectFeature(feature) {
        if (feature) {
          const session = getSession(self)
          const featureWidget = session.addWidget(
            'GDCFeatureWidget',
            'gdcFeature',
            { featureData: feature.toJSON() },
          )
          session.showWidget(featureWidget)
          session.setSelection(feature)
        }
      },
    }))

    .views(self => {
      const {
        renderProps: superRenderProps,
        trackMenuItems: superTrackMenuItems,
      } = self
      return {
        renderProps() {
          return {
            ...superRenderProps,
            config: self.configuration.renderer,
          }
        },

        get rendererTypeName() {
          return self.configuration.renderer.type
        },

        trackMenuItems() {
          return [
            ...superTrackMenuItems(),
            {
              label: 'Filter',
              onClick: self.openFilterConfig,
              icon: FilterListIcon,
            },
          ]
        },
      }
    })
}
