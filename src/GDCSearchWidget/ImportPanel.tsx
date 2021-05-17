import React, { useRef } from 'react'
import { observer } from 'mobx-react'
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
                const res = event.target?.result
                //@ts-ignore
                const r = JSON.parse(res)
                console.log({ r })
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
