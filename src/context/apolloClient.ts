import { ApolloClient, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';

import { cache, typeDefs } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { getToken } from '../api/auth';

const httpLink = createHttpLink({
  uri: `${process.env.SERVER_ENDPOINT}/graphql`,
});

const subgraphHttpLink = createHttpLink({
  uri: process.env.SUBGRAPH_ENDPOINT,
});

const subgraphWebSocketLink = new WebSocketLink({
  uri: process.env.SUBGRAPH_WS_ENDPOINT as string,
  options: {
    reconnect: true,
  },
});

const authLink = setContext((_, { headers }) => {
  const wallet = TEMP_getContext(ContextModule.Wallet);
  if (!wallet) return {};
  // get the authentication token from local storage if it exists
  const token = getToken(wallet.address);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export default new ApolloClient({
  link: ApolloLink.split(
    /*
     * If the operation starts with subscription, redirect to the web socket link
     */
    ({ operationName }) => operationName.startsWith('Subscription'),
    subgraphWebSocketLink,
    /*
     * Otherwise, redirect to one of our two http links: the subgraph server or
     * our own metadata server
     */
    ApolloLink.split(
      /*
       * Only send the queries that start with 'Subgraph' to
       * the `subgraphHttpLink` endpoint
       */
      ({ operationName }) => operationName.startsWith('Subgraph'),
      subgraphHttpLink,
      authLink.concat(httpLink),
    ),
  ),
  cache,
  typeDefs,
  // All resolvers are added via addResolvers
  resolvers: {},
});
