import { ConfigurationReference } from '@jbrowse/core/configuration'
import { InternetAccount } from '@jbrowse/core/pluggableElementTypes/models'
import PluginManager from '@jbrowse/core/PluginManager'
import { FileLocation, AuthLocation } from '@jbrowse/core/util/types'
import { searchOrReplaceInArgs } from '@jbrowse/core/util'
import { GDCInternetAccountConfigModel } from './configSchema'
import { Instance, types, getRoot } from 'mobx-state-tree'
import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  root: {
    margin: theme.spacing(1),
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  imgContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  img: {
    width: 100,
    maxWidth: '100%',
    maxHeight: '100%',
    verticalAlign: 'middle',
  },
  helperTextContainer: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  submitTokenContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  alertContainer: {
    paddingBottom: theme.spacing(2),
  },
}))

interface Account {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

const stateModelFactory = (
  pluginManager: PluginManager,
  configSchema: GDCInternetAccountConfigModel,
) => {
  return types
    .compose(
      'GDCInternetAccount',
      InternetAccount,
      types.model({
        id: 'GDC',
        type: types.literal('GDCInternetAccount'),
        configuration: ConfigurationReference(configSchema),
      }),
    )
    .volatile(() => ({
      externalToken: '',
      currentTypeAuthorizing: '',
      needsToken: false,
    }))
    .views(self => ({
      handlesLocation(location: FileLocation): boolean {
        const validDomains = self.accountConfig.validDomains || []
        return validDomains.some((domain: string) =>
          (location as AuthLocation)?.uri.includes(domain),
        )
      },
    }))
    .actions(self => ({
      async fetchFile(location: string) {
        if (!location || !self.externalToken) {
          return
        }
      },
      setExternalToken(token: string) {
        self.externalToken = token
      },
      setNeedsToken(bool: boolean) {
        self.needsToken = bool
      },
    }))
    .actions(self => {
      let resolve: Function = () => {}
      let reject: Function = () => {}
      let openLocationPromise: Promise<string> | undefined = undefined
      return {
        handleClose(token?: string) {
          const { session } = getRoot(self)
          if ((token && self.needsToken) || (token && !self.needsToken)) {
            console.log(token)
            sessionStorage.setItem(`${self.internetAccountId}-token`, token)
            resolve(token)
          } else {
            // we should only see this error if the resource requires a token
            reject(
              new Error(
                'failed to add track: this is a controlled resource that requires an authenticated token to access. Please verify your credentials and try again.',
              ),
            )
          }
          session.setDialogComponent(undefined, undefined)
          resolve = () => {}
          reject = () => {}
          openLocationPromise = undefined
        },
        async openLocation(location: FileLocation) {
          if (!openLocationPromise) {
            // determine if the resource requires a token
            const query = (location as AuthLocation).uri.split('/').pop()
            const response = await fetch(
              `${self.accountConfig.customEndpoint}/files/${query}?expand=index_files`,
              {
                method: 'GET',
              },
            )

            if (!response.ok) {
              const errorText = await response.text()
              throw new Error(
                `Network response failure: ${response.status} (${errorText})`,
              )
            }

            const metadata = await response.json()
            if (metadata) {
              metadata.data.access === 'controlled'
                ? self.setNeedsToken(true)
                : self.setNeedsToken(false)
            }

            openLocationPromise = new Promise(async (r, x) => {
              if (self.needsToken) {
                const { session } = getRoot(self)
                session.setDialogComponent(GDCTokenEntryForm, {
                  internetAccountId: self.internetAccountId,
                  handleClose: this.handleClose,
                })
              }
              resolve = r
              reject = x
            })
          }
          return openLocationPromise
        },
        async handleRpcMethodCall(
          location: FileLocation,
          authenticationInfoMap: Record<string, string>,
          args: {},
        ) {
          const token = authenticationInfoMap[self.internetAccountId]
          if (!token) {
            await this.openLocation(location)
          }

          try {
            const query = (location as AuthLocation).uri.split('/').pop()
            args = JSON.parse(JSON.stringify(args))
            searchOrReplaceInArgs(
              args,
              'uri',
              `${self.accountConfig.customEndpoint}/data/${query}`,
            )
          } catch (e) {
            await this.handleError(authenticationInfoMap, e)
          }

          return args
        },
        async handleError(
          authenticationInfoMap: Record<string, string>,
          errorText: string,
        ) {
          const rootModel = getRoot(self)
          rootModel.removeFromAuthenticationMap(
            self.internetAccountId,
            authenticationInfoMap,
          )
          return new Error(errorText)
        },
      }
    })
}

const GDCTokenEntryForm = ({
  internetAccountId,
  handleClose,
}: {
  internetAccountId: string
  handleClose: (arg?: string) => void
}) => {
  const [token, setToken] = useState('')
  const classes = useStyles()

  return (
    <>
      <Dialog open onClose={() => handleClose()} maxWidth="sm">
        <DialogTitle>
          Login to access controlled GDC data
          <IconButton
            className={classes.closeButton}
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className={classes.root}>
            <div className={classes.paper}>
              <div className={classes.imgContainer}>
                <img
                  className={classes.img}
                  src="https://me-pedia.org/images/2/2b/NIH_logo.png"
                ></img>
              </div>
              <div className={classes.helperTextContainer}>
                <Typography variant="h6" component="h1" align="center">
                  Login to access controlled data
                </Typography>
                <Typography variant="body1" align="center">
                  An authentication token is required to access controlled data.
                </Typography>
                <Typography variant="body2" align="center">
                  You will need to provide your authentication token every time
                  you start a new session, as the token is deleted when the
                  session expires.
                </Typography>
              </div>
              <div className={classes.submitTokenContainer}>
                <TextField
                  color="primary"
                  variant="outlined"
                  label="Enter token"
                  onChange={event => {
                    setToken(event.target.value)
                  }}
                />
                <div className={classes.buttonContainer}>
                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    onClick={() => {
                      handleClose(token)
                    }}
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default stateModelFactory
export type AlignmentsDisplayStateModel = ReturnType<typeof stateModelFactory>
export type AlignmentsDisplayModel = Instance<AlignmentsDisplayStateModel>
