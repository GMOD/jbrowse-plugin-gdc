import { ConfigurationReference, getConf } from '@jbrowse/core/configuration'
import { InternetAccount } from '@jbrowse/core/pluggableElementTypes/models'
import { UriLocation } from '@jbrowse/core/util/types'
import { GDCInternetAccountConfigModel } from './configSchema'
import { Instance, types, getRoot } from 'mobx-state-tree'
import LoginDialogue from './LoginDialogue'

const stateModelFactory = (configSchema: GDCInternetAccountConfigModel) => {
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
      get authHeader(): string {
        return getConf(self, 'authHeader')
      },
      get customEndpoint(): string {
        return getConf(self, 'customEndpoint')
      },
      get internetAccountType() {
        return 'GDCInternetAccount'
      },
    }))
    .actions(self => ({
      setNeedsToken(bool: boolean) {
        self.needsToken = bool
      },
    }))
    .actions(self => ({
      getTokenFromUser(
        resolve: (token: string) => void,
        reject: (error: Error) => void,
      ) {
        const { session } = getRoot(self)
        session.queueDialog((doneCallback: Function) => [
          LoginDialogue,
          {
            handleClose: (token: string) => {
              if (token) {
                resolve(token)
              } else {
                reject(
                  new Error(
                    'failed to add track: this is a controlled resource that requires an authenticated token to access. Please verify your credentials and try again.',
                  ),
                )
              }
              doneCallback()
            },
          },
        ])
      },
      getFetcher(
        location?: UriLocation,
      ): (input: RequestInfo, init?: RequestInit) => Promise<Response> {
        return async (
          input: RequestInfo,
          init?: RequestInit,
        ): Promise<Response> => {
          // @ts-ignore
          const authToken = await self.getToken(location)
          let newInit = init
          if (authToken !== 'none') {
            // @ts-ignore
            newInit = self.addAuthHeaderToInit(init, authToken)
          }
          let query = String(input)
          if (query.includes('files/')) {
            query = `${self.customEndpoint}/data/${query.split('/')[4]}`
          }
          return fetch(query, newInit)
        }
      },
    }))
    .actions(self => {
      // @ts-ignore
      const superGetToken = self.getToken
      const needsToken = new Map()
      return {
        /**
         * uses the location of the resource to fetch the 'metadata' of the file, which contains the index files (if applicable)
         *  and the property 'controlled' which determines whether the user needs a token to be checked against the resource or
         *  not. if controlled = false, then the user will not be prompted with a token dialogue
         * @param location the uri location of the resource to be fetched
         */
        async getToken(location?: UriLocation) {
          if (location && needsToken.has(location.uri)) {
            if (needsToken.get(location.uri)) {
              return superGetToken(location)
            } else {
              return 'none'
            }
          }
          // determine if the resource requires a token
          const query = location?.uri.split('/').pop()
          const response = await fetch(`${self.customEndpoint}/data/${query}`)

          if (response.status === 403) {
            needsToken.set(location?.uri, true)
            return superGetToken(location)
          } else {
            if (!response.ok) {
              let errorMessage
              try {
                errorMessage = await response.text()
              } catch (error) {
                errorMessage = ''
              }
              throw new Error(
                `Network response failure — ${response.status} (${
                  response.statusText
                }) ${errorMessage ? ` (${errorMessage})` : ''}`,
              )
            }
          }
          needsToken.set(location?.uri, false)
          return 'none'
        },
      }
    })
}

export default stateModelFactory
export type ExternalTokenStateModel = ReturnType<typeof stateModelFactory>
export type ExternalTokenModel = Instance<ExternalTokenStateModel>
