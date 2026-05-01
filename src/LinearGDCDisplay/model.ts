import type { IAnyModelType } from '@jbrowse/mobx-state-tree'
import { types } from '@jbrowse/mobx-state-tree'
import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import { ConfigurationReference } from '@jbrowse/core/configuration'
import { getParentRenderProps } from '@jbrowse/core/util/tracks'
import type { Feature } from '@jbrowse/core/util'
import { getSession, isSessionModelWithWidgets } from '@jbrowse/core/util'
import FilterListIcon from '@mui/icons-material/FilterList'
import type PluginManager from '@jbrowse/core/PluginManager'

import type LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

export default (
  pluginManager: PluginManager,
  configSchema: AnyConfigurationSchemaType,
): IAnyModelType => {
  const { BaseLinearDisplay } = (
    pluginManager.getPlugin('LinearGenomeViewPlugin') as LinearGenomeViewPlugin
  )?.exports

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
        if (isSessionModelWithWidgets(session)) {
          const editor = session.addWidget('GDCFilterWidget', 'gdcFilter', {
            target: self.parentTrack.configuration,
          })
          session.showWidget(editor)
        }
      },

      selectFeature(feature: Feature) {
        const session = getSession(self)
        if (feature && isSessionModelWithWidgets(session)) {
          const featureWidget = session.addWidget(
            'VariantFeatureWidget',
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
            ...superRenderProps(),
            ...getParentRenderProps(self),
            displayModel: self,
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
              onClick: () => {
                self.openFilterConfig()
              },
              icon: FilterListIcon,
            },
          ]
        },
      }
    })
}
