import { TaskDocument, TaskQuery, TaskQueryVariables } from '~data/index';
import { Address } from '~types/index';
import { log } from '~utils/debug';

import apolloCache from './cache';
import {
  ColonySubscribedUsersDocument,
  ColonySubscribedUsersQuery,
  ColonySubscribedUsersQueryVariables,
  UserDocument,
  UserQuery,
  UserQueryVariables,
  UnsubscribeFromColonyMutationResult,
  SubscribeToColonyMutationResult,
  SetTaskSkillMutationResult,
  UserColoniesQuery,
  UserColoniesQueryVariables,
  UserColoniesDocument,
  ColonyMembersWithReputationQuery,
  ColonyMembersWithReputationQueryVariables,
  ColonyMembersWithReputationDocument,
} from './generated';

type Cache = typeof apolloCache;

const cacheUpdates = {
  unsubscribeFromColony(colonyAddress: Address) {
    return (cache: Cache, { data }: UnsubscribeFromColonyMutationResult) => {
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
      /*
       * Update the list of colony subscribed users
       * This is in use in the User Picker (right now we're only using that in
       * the permissions Dialog)
       */
      try {
        const cacheData = cache.readQuery<
          ColonySubscribedUsersQuery,
          ColonySubscribedUsersQueryVariables
        >({
          query: ColonySubscribedUsersDocument,
          variables: {
            colonyAddress,
          },
        });
        if (cacheData && data && data.unsubscribeFromColony) {
          const {
            id: unsubscribedUserWalletAddress,
          } = data.unsubscribeFromColony;
          const { subscribedUsers } = cacheData;
          const updatedColonySubscription = subscribedUsers.filter(
            /*
             * Prop `id` does exist, it's just that TS doesn't recognize for
             * some reason
             */
            // @ts-ignore
            ({ id: userWalletAddress }) =>
              /*
               * Remove the unsubscribed user from the subscribers array
               */
              userWalletAddress !== unsubscribedUserWalletAddress,
          );
          cache.writeQuery<
            ColonySubscribedUsersQuery,
            ColonySubscribedUsersQueryVariables
          >({
            query: ColonySubscribedUsersDocument,
            data: {
              ...cacheData,
              subscribedUsers: updatedColonySubscription,
            },
            variables: {
              colonyAddress,
            },
          });
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
    return (cache: Cache, { data }: SubscribeToColonyMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonySubscribedUsersQuery,
          ColonySubscribedUsersQueryVariables
        >({
          query: ColonySubscribedUsersDocument,
          variables: {
            colonyAddress,
          },
        });
        if (cacheData && data && data.subscribeToColony) {
          const { id: subscribedUserWalletAddress } = data.subscribeToColony;
          const { subscribedUsers } = cacheData;
          /*
           * The subscribed to colony mutation, only returns the user wallet address,
           * but we also need the user's profile to update the subscribers array
           */
          const subscribedUserProfileFromCache = cache.readQuery<
            UserQuery,
            UserQueryVariables
          >({
            query: UserDocument,
            variables: {
              address: subscribedUserWalletAddress,
            },
          });
          if (
            subscribedUserProfileFromCache &&
            subscribedUserProfileFromCache.user
          ) {
            const {
              user: { profile: subscribedUserProfile },
            } = subscribedUserProfileFromCache;
            const updatedColonySubscription = [...subscribedUsers];
            /*
             * Add the subscribed user to the subscribers array
             */
            updatedColonySubscription.push({
              ...data.subscribeToColony,
              profile: subscribedUserProfile,
            });
            cache.writeQuery<
              ColonySubscribedUsersQuery,
              ColonySubscribedUsersQueryVariables
            >({
              query: ColonySubscribedUsersDocument,
              data: {
                ...cacheData.subscribedUsers,
                subscribedUsers: updatedColonySubscription,
              },
              variables: {
                colonyAddress,
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
  setTaskSkill(draftId: string) {
    return (cache: Cache, { data }: SetTaskSkillMutationResult) => {
      try {
        const cacheData = cache.readQuery<TaskQuery, TaskQueryVariables>({
          query: TaskDocument,
          variables: {
            id: draftId,
          },
        });
        const taskData = data && data.setTaskSkill;
        if (cacheData && taskData) {
          cache.writeQuery<TaskQuery, TaskQueryVariables>({
            query: TaskDocument,
            data: {
              task: {
                ...cacheData.task,
                ethSkillId: taskData.ethSkillId,
              },
            },
            variables: {
              id: draftId,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - task not loaded yet');
      }
    };
  },
  removeTaskSkill(draftId: string) {
    return (cache: Cache) => {
      try {
        const cacheData = cache.readQuery<TaskQuery, TaskQueryVariables>({
          query: TaskDocument,
          variables: {
            id: draftId,
          },
        });
        if (cacheData) {
          cache.writeQuery<TaskQuery, TaskQueryVariables>({
            query: TaskDocument,
            data: {
              task: {
                ...cacheData.task,
                ethSkillId: null,
              },
            },
            variables: {
              id: draftId,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - task not loaded yet');
      }
    };
  },
};

export default cacheUpdates;
