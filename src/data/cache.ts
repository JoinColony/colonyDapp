import { InMemoryCache } from '@apollo/client/cache/';

export default new InMemoryCache({
  typePolicies: {
    Colony: {
      fields: {
        installedExtensions: {
          merge(_existing, incoming) {
            return incoming;
          },
        },
      },
    },
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
        unclaimedTransfers: {
          merge: false,
        },
        installedExtensions: {
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
        tokens: {
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
        actionsThatNeedAttention: {
          merge: false,
        },
      },
    },
    Event: {
      fields: {
        associatedColony: {
          merge: false,
        },
      },
    },
  },
});
