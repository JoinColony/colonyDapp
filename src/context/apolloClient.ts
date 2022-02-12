import { ApolloClient, createHttpLink, HttpLink, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

import { cache, typeDefs } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { getToken } from '../api/auth';

const STORAGE_KEY = 'dsettings';
const decentralizedStorage = JSON.parse(
  localStorage.getItem(STORAGE_KEY) as string,
);

export const getApolloUri = (
  url: string = process.env.SERVER_ENDPOINT || '',
  useWebsocket = false,
): string => {
  const apolloServerUrl = new URL(url, window.location.origin);
  if (useWebsocket && !apolloServerUrl.protocol.includes('ws')) {
    apolloServerUrl.protocol =
      apolloServerUrl.protocol === 'http:' ? 'ws:' : 'wss:';
  }
  return apolloServerUrl.href;
};

const httpLink = !decentralizedStorage?.enabled
  ? createHttpLink({
      uri: getApolloUri(`${process.env.SERVER_ENDPOINT}/graphql`),
    })
  : undefined;

const webSocketLink = !decentralizedStorage?.enabled
  ? new WebSocketLink({
      uri: getApolloUri(`${process.env.SERVER_ENDPOINT}/graphql`, true),
      options: {
        reconnect: true,
        connectionParams: () => {
          const wallet = TEMP_getContext(ContextModule.Wallet);
          if (!wallet) return {};

          // get the authentication token from local storage if it exists
          const token = getToken(wallet.address);

          return {
            authorization: token ? `Bearer ${token}` : '',
          };
        },
      },
    })
  : undefined;

// const subgraphHttpLink = createHttpLink({
//   uri: getApolloUri(process.env.SUBGRAPH_ENDPOINT),
// });

// const subgraphWebSocketLink = new WebSocketLink({
//   uri: getApolloUri(
//     process.env.SUBGRAPH_WS_ENDPOINT || process.env.SUBGRAPH_ENDPOINT,
//     true,
//   ),
//   options: {
//     reconnect: true,
//   },
// });

const authLink = !decentralizedStorage?.enabled
  ? setContext((_, { headers }) => {
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
    })
  : undefined;

export default new ApolloClient({
  link: !decentralizedStorage?.enabled
    ? split(
        /*
         * If the operation starts with subscription, redirect to the web socket link
         */
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          );
        },
        webSocketLink as WebSocketLink,
        authLink.concat(httpLink as HttpLink),
      )
    : undefined,
  cache,
  typeDefs,
  // All resolvers are added via addResolvers
  resolvers: {},
});
