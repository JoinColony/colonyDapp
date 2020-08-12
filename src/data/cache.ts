import { InMemoryCache } from '@apollo/client/cache/';

export default new InMemoryCache({
  typePolicies: {
    DomainBalance: {
      keyFields: ['colonyAddress', 'address', 'domainId'],
    },
  },
});
