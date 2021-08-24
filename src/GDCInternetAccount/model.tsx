import { ConfigurationReference } from '@jbrowse/core/configuration'
import { InternetAccount } from '@jbrowse/core/pluggableElementTypes/models'
import PluginManager from '@jbrowse/core/PluginManager'
import { UriLocation } from '@jbrowse/core/util/types'
import { GDCInternetAccountConfigModel } from './configSchema'
import { Instance, types, getParent } from 'mobx-state-tree'
import React, { useState } from 'react'
import { RemoteFile } from 'generic-filehandle'
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

const inWebWorker = typeof sessionStorage === 'undefined'

const stateModelFactory = (
  pluginManager: PluginManager,
  configSchema: GDCInternetAccountConfigModel,
) => {
  return types
    .compose(
      'GDCInternetAccount',
      InternetAccount,
      types.model({
        id: 'GDCToken',
        type: types.literal('GDCInternetAccount'),
        configuration: ConfigurationReference(configSchema),
      }),
    )
    .volatile(() => ({
      needsToken: false,
    }))
    .views(self => ({
      get internetAccountType() {
        return 'GDCTokenInternetAccount'
      },
      handlesLocation(location: UriLocation): boolean {
        // this will probably look at something in the config which indicates that it is an OAuth pathway,
        // also look at location, if location is set to need authentication it would reutrn true
        const validDomains = self.accountConfig.validDomains || []
        return validDomains.some((domain: string) =>
          location?.uri.includes(domain),
        )
      },
      get generateAuthInfo() {
        return {
          internetAccountType: this.internetAccountType,
          authInfo: {
            authHeader: self.authHeader,
            tokenType: '',
            configuration: self.accountConfig,
          },
        }
      },
    }))
    .actions(self => ({
      setNeedsToken(bool: boolean) {
        self.needsToken = bool
      },
    }))
    .actions(self => {
      let resolve: Function = () => {}
      let reject: Function = () => {}
      let openLocationPromise: Promise<string> | undefined = undefined
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let preAuthInfo: any = {}
      return {
        setTokenInfo(token: string) {
          sessionStorage.setItem(`${self.internetAccountId}-token`, token)
        },
        handleClose(token?: string) {
          if (token) {
            if (!inWebWorker) {
              this.setTokenInfo(token)
            }
            resolve(token)
          } else {
            // we will only see this error if the resource requires a token
            reject(
              new Error(
                'failed to add track: this is a controlled resource that requires an authenticated token to access. Please verify your credentials and try again.',
              ),
            )
          }
          resolve = () => {}
          reject = () => {}
          openLocationPromise = undefined
        },
        async checkToken() {
          let token =
            preAuthInfo?.authInfo?.token ||
            (!inWebWorker
              ? sessionStorage.getItem(`${self.internetAccountId}-token`)
              : null)
          if (!token) {
            if (!openLocationPromise) {
              openLocationPromise = new Promise(async (r, x) => {
                // we only need to open the dialog if this resource requires a token
                if (self.needsToken) {
                  const { session } = getParent(self, 2)
                  session.queueDialog((doneCallback: Function) => [
                    GDCTokenEntryForm,
                    {
                      internetAccountId: self.internetAccountId,
                      handleClose: (token: string) => {
                        this.handleClose(token)
                        doneCallback()
                      },
                    },
                  ])
                }
                resolve = r
                reject = x
              })
            }
            token = await openLocationPromise
          }

          if (!preAuthInfo.authInfo.token) {
            preAuthInfo.authInfo.token = token
          }
          resolve()
          openLocationPromise = undefined
          return token
        },
        async getFetcher(
          url: RequestInfo,
          opts?: RequestInit,
        ): Promise<Response> {
          if (!preAuthInfo || !preAuthInfo.authInfo) {
            throw new Error('Authentication information is missing.')
          }

          let foundToken
          try {
            foundToken = await this.checkToken()
          } catch (e) {
            throw new Error(
              'Something went wrong when attempting to fetch the authentication token.',
            )
          }

          let newOpts = opts
          if (foundToken) {
            const newHeaders = {
              ...opts?.headers,
              [preAuthInfo.authInfo
                .authHeader]: `${preAuthInfo.authInfo.token}`,
            }
            newOpts = {
              ...opts,
              headers: newHeaders,
            }
          }
          const query = String(url)
            .split('/')
            .pop()
          url = `${preAuthInfo.authInfo.configuration.customEndpoint}/data/${query}`
          return fetch(url as RequestInfo, {
            method: 'GET',
            credentials: 'same-origin',
            ...newOpts,
          })
        },
        openLocation(location: UriLocation) {
          preAuthInfo =
            location.internetAccountPreAuthorization || self.generateAuthInfo
          return new RemoteFile(String(location.uri), {
            fetch: this.getFetcher,
          })
        },
        /**
         * uses the location of the resource to fetch the 'metadata' of the file, which contains the index files (if applicable)
         *  and the property 'controlled' which determines whether the user needs a token to be checked against the resource or
         *  not. if controlled = false, then the user will not be prompted with a token dialogue
         * @param location the uri location of the resource to be fetched
         */
        async checkMetadata(location: UriLocation) {
          // determine if the resource requires a token
          const query = location?.uri.split('/').pop()
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
        },
        async getPreAuthorizationInformation(location: UriLocation) {
          if (!preAuthInfo.authInfo) {
            preAuthInfo = self.generateAuthInfo
          }

          // needs to check the metadata first so we know whether or not to collect a token from the user
          await this.checkMetadata(location)
          await this.checkToken()

          return preAuthInfo
        },
        async handleError(errorText: string) {
          preAuthInfo = self.generateAuthInfo
          if (!inWebWorker) {
            sessionStorage.removeItem(`${self.internetAccountId}-token`)
          }

          throw new Error(errorText)
        },
      }
    })
}

const GDCTokenEntryForm = ({
  handleClose,
}: {
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
export type ExternalTokenStateModel = ReturnType<typeof stateModelFactory>
export type ExternalTokenModel = Instance<ExternalTokenStateModel>
