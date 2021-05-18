import { ConfigurationReference } from '@jbrowse/core/configuration'
import { getParentRenderProps } from '@jbrowse/core/util/tracks'
import { getSession } from '@jbrowse/core/util'
import FilterListIcon from '@material-ui/icons/FilterList'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import configSchemaF from './configSchema'

export default jbrowse => {
  const { types } = jbrowse.jbrequire('mobx-state-tree')

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

      openUploadWidget() {
        const session = getSession(self)
        const uploadWidget = session.addWidget(
          'GDCUploadWidget', 
          'gdcUpload',
          { target: self.parentTrack.configuration, }
        )
        session.showWidget(uploadWidget)
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

      get trackMenuItems() {
        return [
          {
            label: 'Filter',
            onClick: self.openFilterConfig,
            icon: FilterListIcon,
          }
        ]
      },

      get viewMenuActions() {
        return [
          {
            label: 'Upload GDC Track via JSON',
            onClick: self.openUploadWidget,
            icon: CloudUploadIcon,
          }
        ]
      }
    }))
}
