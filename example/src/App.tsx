import * as React from 'react'
import { Admin, Resource } from 'chakra-admin'
import Company from './resources/Company'
import { client } from './graphqlClient'
import '@fontsource/sora'
import { ChakraProvider, theme } from '@chakra-ui/react'
import { Route } from 'react-router-dom'
import { ExampleStrategy } from './ExampleStrategy'


export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Admin client={client} strategy={ExampleStrategy}>
        <Resource {...Company} />
        <Route path="my-custom-route" element={<>My Custom Route</>} />
      </Admin>
    </ChakraProvider>
  )
}