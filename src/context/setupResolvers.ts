import ApolloClient from 'apollo-client';

import { resolvers } from '~data/index';

const setupResolvers = (apolloClient: ApolloClient<any>, context: any) => {
  resolvers.forEach(setupResolver =>
    apolloClient.addResolvers(setupResolver(context)),
  );
};

export default setupResolvers;
