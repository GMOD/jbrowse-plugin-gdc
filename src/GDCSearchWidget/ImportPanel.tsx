import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
  },
  fileInput: {
    marginBottom: theme.spacing(2),
  },
}))
const Panel = ({ model }: { model: any }) => {
  const classes = useStyles()
  const ref = useRef<HTMLInputElement>(null)
  const session = getSession(model)
  return (
    <div className={classes.container}>
      <div className={classes.fileInput}>
        <label htmlFor="importjson">
          Import JSON containing files to import
        </label>
        <input ref={ref} id="importjson" type="file" />
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          if (ref.current) {
            const file = ref.current.files?.[0]

            if (file) {
              const reader = new FileReader()
              reader.addEventListener('load', event => {
                const res = JSON.parse(event.target?.result as string)
                const t = res.slice(0, 40)
                t.map((file: { file_id: string; file_name: string }) => {
                  //@ts-ignore
                  session.addTrackConf({
                    type: 'QuantitativeTrack',
                    trackId: file.file_id,
                    name: file.file_name,
                    assemblyNames: ['hg38'],
                    adapter: {
                      type: 'SegmentCNVAdapter',
                      segLocation: {
                        uri: 'https://api.gdc.cancer.gov/data/' + file.file_id,
                      },
                    },
                  })
                  //@ts-ignore
                  session.views[0].showTrack(
                    file.file_id,
                    {},
                    {
                      height: 20,
                      constraints: { max: 2, min: -2 },
                      rendererTypeNameState: 'density',
                    },
                  )
                })
              })
              reader.readAsText(file)
            }
          }
        }}
      >
        Submit
      </Button>
    </div>
  )
}

export default observer(Panel)
