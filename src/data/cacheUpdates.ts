import { bigNumberify } from 'ethers/utils';
import { ClientType, ColonyClientV5 } from '@colony/colony-js';

import { Address } from '~types/index';
import { log } from '~utils/debug';
import apolloCache from './cache';
import {
  UnsubscribeFromColonyMutationResult,
  SubscribeToColonyMutationResult,
  UserColoniesQuery,
  UserColoniesQueryVariables,
  UserColoniesDocument,
  ColonyMembersWithReputationQuery,
  ColonyMembersWithReputationQueryVariables,
  ColonyMembersWithReputationDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from './generated';
import { ContextModule, TEMP_getContext } from '~context/index';

type Cache = typeof apolloCache;

const cacheUpdates = {
  unsubscribeFromColony(colonyAddress: Address) {
    return (cache: Cache, { data }: UnsubscribeFromColonyMutationResult) => {
      /*
       * Update the list of subscribed user, with reputation, but only for the
       * "All Domains" selection
       */
      try {
        if (data?.unsubscribeFromColony) {
          const {
            id: unsubscribedUserWalletAddress,
          } = data.unsubscribeFromColony;
          const cacheData = cache.readQuery<
            ColonyMembersWithReputationQuery,
            ColonyMembersWithReputationQueryVariables
          >({
            query: ColonyMembersWithReputationDocument,
            variables: {
              colonyAddress,
              /*
               * We only care about the "All Domains" entry here, since this is
               * the only one that displays all the subscribed colony members
               *
               * The other, actual domains, show all users that have reputation,
               * iregardless of wheter they're subscribed to the colony or not
               */
              domainId: 0,
            },
          });
          if (cacheData?.colonyMembersWithReputation) {
            const { colonyMembersWithReputation } = cacheData;
            // eslint-disable-next-line max-len
            const updatedUsersWithReputationList = colonyMembersWithReputation.filter(
              (userAddress) => !(userAddress === unsubscribedUserWalletAddress),
            );
            cache.writeQuery<
              ColonyMembersWithReputationQuery,
              ColonyMembersWithReputationQueryVariables
            >({
              query: ColonyMembersWithReputationDocument,
              data: {
                colonyMembersWithReputation: updatedUsersWithReputationList,
              },
              variables: {
                colonyAddress,
                domainId: 0,
              },
            });
          }
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Cannot update the colony subscriptions cache - not loaded yet',
        );
      }
      /*
       * Update the list of colonies the user is subscribed to
       * This is in use in the subscribed colonies component(s)
       */
      try {
        if (data?.unsubscribeFromColony) {
          const {
            id: unsubscribedUserWalletAddress,
          } = data.unsubscribeFromColony;
          const cacheData = cache.readQuery<
            UserColoniesQuery,
            UserColoniesQueryVariables
          >({
            query: UserColoniesDocument,
            variables: {
              address: unsubscribedUserWalletAddress,
            },
          });
          if (cacheData?.user?.processedColonies) {
            const {
              user: { processedColonies },
              user,
            } = cacheData;
            const updatedSubscribedColonies = processedColonies.filter(
              (subscribedColony) =>
                !(subscribedColony?.colonyAddress === colonyAddress),
            );
            cache.writeQuery<UserColoniesQuery, UserColoniesQueryVariables>({
              query: UserColoniesDocument,
              data: {
                user: {
                  ...user,
                  processedColonies: updatedSubscribedColonies,
                },
              },
              variables: {
                address: unsubscribedUserWalletAddress,
              },
            });
          }
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Cannot update the colony subscriptions cache - not loaded yet',
        );
      }
    };
  },
  subscribeToColony(colonyAddress: Address) {
    return async (cache: Cache, { data }: SubscribeToColonyMutationResult) => {
      const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
      /*
       * Update the list of subscribed user, with reputation, but only for the
       * "All Domains" selection
       */
      try {
        if (data?.subscribeToColony) {
          const { id: subscribedUserAddress } = data.subscribeToColony;
          const cacheData = cache.readQuery<
            ColonyMembersWithReputationQuery,
            ColonyMembersWithReputationQueryVariables
          >({
            query: ColonyMembersWithReputationDocument,
            variables: {
              colonyAddress,
              /*
               * We only care about the "All Domains" entry here, since this is
               * the only one that displays all the subscribed colony members
               *
               * The other, actual domains, show all users that have reputation,
               * iregardless of wheter they're subscribed to the colony or not
               */
              domainId: 0,
            },
          });
          if (cacheData?.colonyMembersWithReputation) {
            const { colonyMembersWithReputation } = cacheData;
            const updatedUsersWithReputationList = [
              ...colonyMembersWithReputation,
              subscribedUserAddress,
            ];
            cache.writeQuery<
              ColonyMembersWithReputationQuery,
              ColonyMembersWithReputationQueryVariables
            >({
              query: ColonyMembersWithReputationDocument,
              data: {
                colonyMembersWithReputation: updatedUsersWithReputationList,
              },
              variables: {
                colonyAddress,
                domainId: 0,
              },
            });
          }
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Cannot update the colony subscriptions cache - not loaded yet',
        );
      }
      /*
       * Update the list of colonies the user is subscribed to
       * This is in use in the subscribed colonies component(s)
       */
      try {
        if (data?.subscribeToColony) {
          const { id: subscribedUserAddress } = data.subscribeToColony;
          const cacheData = cache.readQuery<
            UserColoniesQuery,
            UserColoniesQueryVariables
          >({
            query: UserColoniesDocument,
            variables: {
              address: subscribedUserAddress,
            },
          });
          if (cacheData?.user?.processedColonies) {
            const {
              user: { processedColonies },
              user,
            } = cacheData;
            let newlySubscribedColony;
            try {
              newlySubscribedColony = cache.readQuery<
                ProcessedColonyQuery,
                ProcessedColonyQueryVariables
              >({
                query: ProcessedColonyDocument,
                variables: {
                  address: colonyAddress,
                },
              });
            } catch (error) {
              const newColonyQuery = await apolloClient.query<
                ProcessedColonyQuery,
                ProcessedColonyQueryVariables
              >({
                query: ProcessedColonyDocument,
                variables: {
                  address: colonyAddress,
                },
              });
              newlySubscribedColony = newColonyQuery?.data;
            }
            if (newlySubscribedColony?.processedColony) {
              const updatedSubscribedColonies = [
                ...processedColonies,
                newlySubscribedColony.processedColony,
              ];
              cache.writeQuery<UserColoniesQuery, UserColoniesQueryVariables>({
                query: UserColoniesDocument,
                data: {
                  user: {
                    ...user,
                    processedColonies: updatedSubscribedColonies,
                  },
                },
                variables: {
                  address: subscribedUserAddress,
                },
              });
            }
          }
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Cannot update the colony subscriptions cache - not loaded yet',
        );
      }
    };
  },
  setNativeTokenPermissions() {
    return async (cache: Cache) => {
      try {
        const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
        if (colonyManager?.colonyClients?.entries()?.next()?.value) {
          const [
            colonyAddress,
          ] = colonyManager.colonyClients.entries().next().value;
          const colonyClient = (await colonyManager.getClient(
            ClientType.ColonyClient,
            colonyAddress,
          )) as ColonyClientV5;
          let canMintNativeToken = true;
          try {
            await colonyClient.estimate.mintTokens(bigNumberify(1));
          } catch (error) {
            canMintNativeToken = false;
          }

          let canUnlockNativeToken = true;
          try {
            await colonyClient.estimate.unlockToken();
          } catch (error) {
            canUnlockNativeToken = false;
          }

          const data = cache.readQuery<
            ProcessedColonyQuery,
            ProcessedColonyQueryVariables
          >({
            query: ProcessedColonyDocument,
            variables: {
              address: colonyAddress,
            },
          });

          if (data?.processedColony) {
            cache.modify({
              id: cache.identify(data.processedColony),
              fields: {
                canUserMintNativeToken: () => canMintNativeToken,
                canUnlockNativeToken: () => canUnlockNativeToken,
              },
            });
          }
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Not updating store - cannot set mint native tokens caches',
        );
      }
    };
  },
};

export default cacheUpdates;
