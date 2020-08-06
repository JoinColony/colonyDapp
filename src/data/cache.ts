import { InMemoryCache } from '@apollo/client/cache/';

// import introspectionResult from './generated';

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData: introspectionResult,
// });

export default new InMemoryCache({
  typePolicies: {
    DomainBalance: {
      keyFields: ['colonyAddress', 'address', 'domainId'],
    }
  },
  // fragmentMatcher,
});
