import { ApolloClient, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { cache, typeDefs } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { getToken } from '../api/auth';

const httpLink = createHttpLink({
  uri: `${process.env.SERVER_ENDPOINT}/graphql`,
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
  link: authLink.concat(httpLink),
  cache,
  typeDefs,
  // All resolvers are added via addResolvers
  resolvers: {},
});
