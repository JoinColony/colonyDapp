import ApolloClient from 'apollo-client';

import { Context } from '~context/index';
import { resolvers } from '~data/index';

const setupResolvers = (
  apolloClient: ApolloClient<object>,
  context: Required<Context>,
) => {
  resolvers.forEach((setupResolver) =>
    apolloClient.addResolvers(setupResolver(context)),
  );
};

export default setupResolvers;
