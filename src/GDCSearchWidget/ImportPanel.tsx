import React, { useState, useRef } from 'react'
import { observer } from 'mobx-react'
import { getSession } from '@jbrowse/core/util'
import { Button, Typography, makeStyles } from '@material-ui/core'

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
  const [error, setError] = useState<Error>()
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
        onClick={async () => {
          if (ref.current) {
            const file = ref.current.files?.[0]

            if (file) {
              try {
                const res = await new Promise(resolve => {
                  const reader = new FileReader()
                  reader.addEventListener('load', event =>
                    resolve(JSON.parse(event.target?.result as string)),
                  )
                  reader.readAsText(file)
                })

                //@ts-ignore
                const t = res.slice(0, 5)
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
                      height: 12,
                      constraints: { max: 2, min: -2 },
                      rendererTypeNameState: 'density',
                    },
                  )
                })
              } catch (e) {
                console.error(e)
                setError(e)
              }
            }
          }
        }}
      >
        Submit
      </Button>
      {error ? (
        <Typography color="error">{`${error.message.slice(
          0,
          200,
        )}`}</Typography>
      ) : null}
    </div>
  )
}

export default observer(Panel)
