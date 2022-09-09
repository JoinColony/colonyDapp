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
        safes: {
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
        colonyMembersWithReputation: {
          merge: false,
        },
        actionsThatNeedAttention: {
          merge: false,
        },
        bannedUsers: {
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
    Subscription: {
      fields: {
        subscribedUsers: {
          merge: false,
        },
      },
    },
  },
});
