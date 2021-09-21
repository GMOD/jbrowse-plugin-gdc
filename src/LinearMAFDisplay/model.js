import { ConfigurationReference } from '@jbrowse/core/configuration'
import { getParentRenderProps } from '@jbrowse/core/util/tracks'
import { getSession } from '@jbrowse/core/util'
import configSchemaF from './configSchema'
import { types, getEnv } from 'mobx-state-tree'

export default jbrowse => {
  const configSchema = jbrowse.jbrequire(configSchemaF)

  const { BaseLinearDisplay } = jbrowse.getPlugin(
    'LinearGenomeViewPlugin',
  ).exports

  return types
    .compose(
      'LinearMAFDisplay',
      BaseLinearDisplay,
      types.model({
        type: types.literal('LinearMAFDisplay'),
        configuration: ConfigurationReference(configSchema),
      }),
    )

    .actions(self => ({
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
      const { renderProps: superRenderProps } = self

      return {
        renderProps() {
          const config = self.rendererType.configSchema.create(
            {
              color1: `jexl:mafColouring(feature)`,
            },
            getEnv(self),
          )
          return {
            ...superRenderProps(),
            ...getParentRenderProps(self),
            displayModel: self,
            config,
          }
        },

        get rendererTypeName() {
          return self.configuration.renderer.type
        },
      }
    })
}
