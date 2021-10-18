import { ConfigurationReference, getConf } from '@jbrowse/core/configuration'
import { InternetAccount } from '@jbrowse/core/pluggableElementTypes/models'
import { UriLocation } from '@jbrowse/core/util/types'
import { GDCInternetAccountConfigModel } from './configSchema'
import { Instance, types, getParent } from 'mobx-state-tree'
import { RemoteFile } from 'generic-filehandle'
import LoginDialogue from './LoginDialogue'

const inWebWorker = typeof sessionStorage === 'undefined'

const stateModelFactory = (configSchema: GDCInternetAccountConfigModel) => {
  return types
    .compose(
      'ExternalTokenInternetAccount',
      InternetAccount,
      types.model({
        id: 'GDCToken',
        type: types.literal('ExternalTokenInternetAccount'),
        configuration: ConfigurationReference(configSchema),
      }),
    )
    .volatile(() => ({
      needsToken: false,
    }))
    .views(self => ({
      get authHeader(): string {
        return getConf(self, 'authHeader') || 'Authorization'
      },
      get internetAccountType() {
        return 'ExternalTokenInternetAccount'
      },
      handlesLocation(location: UriLocation): boolean {
        // this will probably look at something in the config which indicates that it is an OAuth pathway,
        // also look at location, if location is set to need authentication it would reutrn true
        const validDomains = self.accountConfig.validDomains || []
        return validDomains.some((domain: string) =>
          location?.uri.includes(domain),
        )
      },
      generateAuthInfo() {
        return {
          internetAccountType: this.internetAccountType,
          authInfo: {
            authHeader: this.authHeader,
            tokenType: '',
            configuration: self.accountConfig,
            token: '',
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
                    LoginDialogue,
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

          if (!preAuthInfo?.authInfo?.token) {
            preAuthInfo = self.generateAuthInfo()
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
            location.internetAccountPreAuthorization || self.generateAuthInfo()
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

export default stateModelFactory
export type ExternalTokenStateModel = ReturnType<typeof stateModelFactory>
export type ExternalTokenModel = Instance<ExternalTokenStateModel>
