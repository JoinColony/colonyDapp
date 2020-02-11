import {
  ColonyTasksQuery,
  ColonyTasksQueryVariables,
  ColonyTasksDocument,
  OneSuggestion,
} from '~data/index';
import { Address } from '~types/index';
import { log } from '~utils/debug';

import apolloCache from './cache';
import {
  ColonySuggestionsQuery,
  ColonySuggestionsQueryVariables,
  ColonySuggestionsDocument,
  SetSuggestionStatusMutationResult,
  SuggestionStatus,
  CreateTaskMutationResult,
  CreateTaskFromSuggestionMutationResult,
  ColonySubscribedUsersQuery,
  ColonySubscribedUsersQueryVariables,
  ColonySubscribedUsersDocument,
  UserQuery,
  UserQueryVariables,
  UserDocument,
  CreateProgramMutationResult,
  ColonyProgramsQuery,
  ColonyProgramsQueryVariables,
  ColonyProgramsDocument,
} from './generated';

type Cache = typeof apolloCache;

const cacheUpdates = {
  createProgram(colonyAddress: Address) {
    return (cache: Cache, { data }: CreateProgramMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonyProgramsQuery,
          ColonyProgramsQueryVariables
        >({
          query: ColonyProgramsDocument,
          variables: {
            address: colonyAddress,
          },
        });
        const createProgramData = data && data.createProgram;
        if (cacheData && createProgramData) {
          const programs = cacheData.colony.programs || [];
          programs.push(createProgramData);
          cache.writeQuery<ColonyProgramsQuery, ColonyProgramsQueryVariables>({
            data: {
              colony: {
                ...cacheData.colony,
                programs,
              },
            },
            query: ColonyProgramsDocument,
            variables: {
              address: colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - colony programs not loaded yet');
      }
    };
  },
  createTask(colonyAddress: Address) {
    return (cache: Cache, { data }: CreateTaskMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonyTasksQuery,
          ColonyTasksQueryVariables
        >({
          query: ColonyTasksDocument,
          variables: {
            address: colonyAddress,
          },
        });
        const createTaskData = data && data.createTask;
        if (cacheData && createTaskData) {
          const tasks = cacheData.colony.tasks || [];
          tasks.push(createTaskData);
          cache.writeQuery<ColonyTasksQuery, ColonyTasksQueryVariables>({
            query: ColonyTasksDocument,
            data: {
              colony: {
                ...cacheData.colony,
                tasks,
              },
            },
            variables: {
              address: colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - colony tasks not loaded yet');
      }
    };
  },
  createTaskFromSuggestion(
    colonyAddress: Address,
    suggestionId: OneSuggestion['id'],
  ) {
    return (cache: Cache, { data }: CreateTaskFromSuggestionMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonySuggestionsQuery,
          ColonySuggestionsQueryVariables
        >({
          query: ColonySuggestionsDocument,
          variables: {
            colonyAddress,
          },
        });
        if (cacheData) {
          const suggestions = cacheData.colony.suggestions.map(suggestion =>
            suggestion.id === suggestionId
              ? { ...suggestion, status: SuggestionStatus.Accepted } // update status of changed suggestion
              : suggestion,
          );
          cache.writeQuery<
            ColonySuggestionsQuery,
            ColonySuggestionsQueryVariables
          >({
            query: ColonySuggestionsDocument,
            data: {
              colony: {
                ...cacheData.colony,
                suggestions,
              },
            },
            variables: {
              colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - suggestions not loaded yet');
      }
      try {
        const cacheData = cache.readQuery<
          ColonyTasksQuery,
          ColonyTasksQueryVariables
        >({
          query: ColonyTasksDocument,
          variables: {
            address: colonyAddress,
          },
        });
        const createTaskData = data && data.createTaskFromSuggestion;
        if (cacheData && createTaskData) {
          const tasks = cacheData.colony.tasks || [];
          tasks.push(createTaskData);
          cache.writeQuery<ColonyTasksQuery, ColonyTasksQueryVariables>({
            query: ColonyTasksDocument,
            data: {
              colony: {
                ...cacheData.colony,
                tasks,
              },
            },
            variables: {
              address: colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - colony tasks not loaded yet');
      }
    };
  },
  setSuggestionStatus(colonyAddress: Address) {
    return (cache: Cache, { data }: SetSuggestionStatusMutationResult) => {
      try {
        const cacheData = cache.readQuery<
          ColonySuggestionsQuery,
          ColonySuggestionsQueryVariables
        >({
          query: ColonySuggestionsDocument,
          variables: {
            colonyAddress,
          },
        });
        if (cacheData && data && data.setSuggestionStatus) {
          const { id: suggestionId, status } = data.setSuggestionStatus;
          const suggestions =
            status === SuggestionStatus.Deleted
              ? cacheData.colony.suggestions.filter(
                  // remove suggestion from cache
                  ({ id }) => id !== suggestionId,
                )
              : cacheData.colony.suggestions.map(suggestion =>
                  suggestion.id === suggestionId // update status of changed suggestion
                    ? { ...suggestion, status }
                    : suggestion,
                );
          cache.writeQuery<
            ColonySuggestionsQuery,
            ColonySuggestionsQueryVariables
          >({
            query: ColonySuggestionsDocument,
            data: {
              colony: {
                ...cacheData.colony,
                suggestions,
              },
            },
            variables: {
              colonyAddress,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - suggestions not loaded yet');
      }
    };
  },
  unsubscribeFromColony(colonyAddress: Address) {
    return (cache: Cache, { data }: any) => {
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
          const { subscribedUsers } = cacheData.colony;
          const updatedColonySubscription = subscribedUsers.filter(
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
              colony: {
                ...cacheData.colony,
                subscribedUsers: updatedColonySubscription,
              },
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
    return (cache: Cache, { data }: any) => {
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
          const { subscribedUsers } = cacheData.colony;
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
                colony: {
                  ...cacheData.colony,
                  subscribedUsers: updatedColonySubscription,
                },
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
};

export default cacheUpdates;
