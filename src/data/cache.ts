import { InMemoryCache } from '@apollo/client/cache/';

export default new InMemoryCache({
  typePolicies: {
    DomainBalance: {
      keyFields: ['colonyAddress', 'address', 'domainId'],
    },
    ProcessedColony: {
      fields: {
        tokenAddresses: {
          merge: false,
        },
        tokens: {
          merge: false,
        },
      },
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
