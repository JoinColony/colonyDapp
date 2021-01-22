import { InMemoryCache } from '@apollo/client/cache/';

export default new InMemoryCache({
  typePolicies: {
    DomainBalance: {
      keyFields: ['colonyAddress', 'address', 'domainId'],
    },
    User: {
      fields: {
        colonyAddresses: {
          merge: false,
        },
        profile: {
          merge: false,
        },
        processedColonies: {
          merge: false,
        },
      },
    },
    Query: {
      fields: {
        subscribedUsers: {
          merge: false,
        },
        colonyMembersWithReputation: {
          merge: false,
        },
      },
    },
  },
});
