import React, { FC } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import {
  I18nProvider,
  I18nProviderProps,
  defaultI18n,
  getDefaultI18nOptions,
  en as enLanguage,
} from 'ca-i18n'
import { AdminCore, AdminCoreProps } from './AdminCore'

export type AdminProps<TCache> = AdminCoreProps & {
  client: ApolloClient<TCache>
  loadingComponent?: React.ReactNode
  i18nProviderProps?: Omit<I18nProviderProps, 'fallback'>
}

/**
 * Main entry point for the admin panel.
 *
 * It initialize the apollo client, the authProvider, the layout of the application and the routes.
 *
 * @example
 *
 * // basic example
 *
 * import { Admin, Resource } from 'chakra-admin'
 *
 * const App = () => (
 *  <Admin makeClient={createGraphqlClient}>
 *    <Resource name="Company" list={CompanyList} />
 *  </Admin>
 * )
 *
 * // with custom routes
 * import { Admin, Resource } from 'chakra-admin'
 *
 * const App = () => (
 * <Admin makeClient={createGraphqlClient}>
 *  <Resource name="Company" list={CompanyList} />
 *  <Route path="my-custom-route" element={<>My Custom Route</>} />
 * </Admin>
 *
 */
export const Admin: FC<AdminProps<any>> = ({
  client,
  loadingComponent,
  i18nProviderProps = {
    i18n: defaultI18n,
    options: getDefaultI18nOptions({ en: enLanguage }),
  },
  ...props
}) => {
  return (
    <RecoilRoot>
      <ApolloProvider client={client}>
        <I18nProvider {...(i18nProviderProps as any)} fallback={loadingComponent}>
          <Router>
            <AdminCore {...props} />
          </Router>
        </I18nProvider>
      </ApolloProvider>
    </RecoilRoot>
  )
}
