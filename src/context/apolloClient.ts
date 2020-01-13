import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

import { cache, typeDefs } from '~data/index';
import { TEMP_getNewContext } from '~context/index';

import { getToken } from '../api/auth';

export { ApolloProvider } from '@apollo/react-hooks';

const httpLink = createHttpLink({
  uri: `${process.env.SERVER_ENDPOINT}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const wallet = TEMP_getNewContext('wallet');
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
  link: authLink.concat(httpLink),
  cache,
  typeDefs,
  // All resolvers are added via addResolvers
  resolvers: {},
});
