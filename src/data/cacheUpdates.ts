import {
  ColonyTasksDocument,
  ColonyTasksQuery,
  ColonyTasksQueryVariables,
  OneLevel,
  OneProgram,
  TaskDocument,
  TaskQuery,
  TaskQueryVariables,
} from '~data/index';
import { Address } from '~types/index';
import { log } from '~utils/debug';

import apolloCache from './cache';
import {
  AcceptLevelTaskSubmissionMutationResult,
  ColonyProgramsDocument,
  ColonyProgramsQuery,
  ColonyProgramsQueryVariables,
  ColonySubscribedUsersDocument,
  ColonySubscribedUsersQuery,
  ColonySubscribedUsersQueryVariables,
  CreateLevelMutationResult,
  CreateProgramMutationResult,
  CreateTaskMutationResult,
  LevelDocument,
  LevelQuery,
  LevelQueryVariables,
  ProgramDocument,
  ProgramQuery,
  ProgramQueryVariables,
  ProgramSubmissionsDocument,
  ProgramSubmissionsQuery,
  ProgramSubmissionsQueryVariables,
  RemoveLevelTaskMutationResult,
  UserDocument,
  UserQuery,
  UserQueryVariables,
  SubmissionStatus,
  RemoveLevelMutationResult,
  UnsubscribeFromColonyMutationResult,
  SubscribeToColonyMutationResult,
  SetTaskSkillMutationResult,
  CreateColonyMutationResult,
  UserColonyAddressesQuery,
  UserColonyAddressesQueryVariables,
  UserColonyAddressesDocument,
  UserColoniesQuery,
  UserColoniesQueryVariables,
  UserColoniesDocument,
} from './generated';

type Cache = typeof apolloCache;

const cacheUpdates = {
  acceptLevelTaskSubmission(programId: OneProgram['id']) {
    return (
      cache: Cache,
      { data }: AcceptLevelTaskSubmissionMutationResult,
    ) => {
      try {
        const cacheData = cache.readQuery<
          ProgramSubmissionsQuery,
          ProgramSubmissionsQueryVariables
        >({
          query: ProgramSubmissionsDocument,
          variables: { id: programId },
        });
        const acceptSubmissionData = data && data.acceptLevelTaskSubmission;
        if (cacheData && acceptSubmissionData) {
          const isAccepted =
            acceptSubmissionData.status === SubmissionStatus.Accepted;
          const submissions = isAccepted
            ? cacheData.program.submissions.filter(
                ({ id }) => id !== acceptSubmissionData.id,
              )
            : cacheData.program.submissions;
          cache.writeQuery<
            ProgramSubmissionsQuery,
            ProgramSubmissionsQueryVariables
          >({
            data: {
              program: {
                ...cacheData.program,
                submissions,
              },
            },
            query: ProgramSubmissionsDocument,
            variables: { id: programId },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose(
          'Not updating store - level step submissions not loaded yet',
        );
      }
    };
  },
  createLevel(programId: OneProgram['id']) {
    return (cache: Cache, { data }: CreateLevelMutationResult) => {
      try {
        const cacheData = cache.readQuery<ProgramQuery, ProgramQueryVariables>({
          query: ProgramDocument,
          variables: {
            id: programId,
          },
        });
        const createLevelData = data && data.createLevel;
        if (cacheData && createLevelData) {
          const existingLevels = cacheData.program.levels || [];
          const levels = [...existingLevels, createLevelData];
          const existingLevelIds = cacheData.program.levelIds || [];
          const levelIds = [...existingLevelIds, createLevelData.id];
          cache.writeQuery<ProgramQuery, ProgramQueryVariables>({
            data: {
              program: {
                ...cacheData.program,
                levelIds,
                levels,
              },
            },
            query: ProgramDocument,
            variables: {
              id: programId,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - colony programs not loaded yet');
      }
    };
  },
  removeLevel(programId: OneProgram['id']) {
    return (cache: Cache, { data }: RemoveLevelMutationResult) => {
      try {
        const cacheData = cache.readQuery<ProgramQuery, ProgramQueryVariables>({
          query: ProgramDocument,
          variables: {
            id: programId,
          },
        });
        const removeLevelData = data && data.removeLevel;
        if (cacheData && removeLevelData) {
          const { id: removedId } = removeLevelData;
          const levels = cacheData.program.levels.filter(
            ({ id }) => id !== removedId,
          );
          const levelIds = cacheData.program.levelIds.filter(
            (id) => id !== removedId,
          );
          cache.writeQuery<ProgramQuery, ProgramQueryVariables>({
            data: {
              program: {
                ...cacheData.program,
                levelIds,
                levels,
              },
            },
            query: ProgramDocument,
            variables: {
              id: programId,
            },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - program levels not loaded yet');
      }
    };
  },
  removeLevelTask(levelId: OneLevel['id']) {
    return (cache: Cache, { data }: RemoveLevelTaskMutationResult) => {
      try {
        const cacheData = cache.readQuery<LevelQuery, LevelQueryVariables>({
          query: LevelDocument,
          variables: { id: levelId },
        });
        const removedLevelTaskData = data && data.removeLevelTask;
        if (cacheData && removedLevelTaskData) {
          const steps = cacheData.level.steps.filter(
            ({ id }) => id !== removedLevelTaskData.id,
          );
          const stepIds = cacheData.level.stepIds.filter(
            (id) => id !== removedLevelTaskData.id,
          );
          let { numRequiredSteps } = cacheData.level;
          if (
            typeof numRequiredSteps === 'number' &&
            numRequiredSteps > stepIds.length
          ) {
            numRequiredSteps = stepIds.length;
          }
          cache.writeQuery<LevelQuery, LevelQueryVariables>({
            data: {
              level: {
                ...cacheData.level,
                numRequiredSteps,
                stepIds,
                steps,
              },
            },
            query: LevelDocument,
            variables: { id: levelId },
          });
        }
      } catch (e) {
        log.verbose(e);
        log.verbose('Not updating store - level tasks not loaded yet');
      }
    };
  },
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
          const existingPrograms = cacheData.colony.programs || [];
          const programs = [...existingPrograms, createProgramData];
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
          const existingTasks = cacheData.colony.tasks || [];
          const tasks = [...existingTasks, createTaskData];
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
  createColony(walletAddress: Address) {
    return (cache: Cache, { data }: CreateColonyMutationResult) => {
      if (data && data.createColony) {
        try {
          const cacheData = cache.readQuery<
            UserColonyAddressesQuery,
            UserColonyAddressesQueryVariables
          >({
            query: UserColonyAddressesDocument,
            variables: {
              address: walletAddress,
            },
          });
          if (cacheData) {
            const existingColonyAddresses =
              cacheData.user.colonyAddresses || [];
            const colonyAddresses = [
              ...existingColonyAddresses,
              data.createColony.colonyAddress,
            ];
            cache.writeQuery<
              UserColonyAddressesQuery,
              UserColonyAddressesQueryVariables
            >({
              query: UserColonyAddressesDocument,
              data: {
                user: {
                  ...cacheData.user,
                  colonyAddresses,
                },
              },
              variables: {
                address: walletAddress,
              },
            });
          }
        } catch (e) {
          log.verbose(e);
          log.verbose(
            'Not updating store - user colony addresses not loaded yet',
          );
        }
        try {
          const cacheData = cache.readQuery<
            UserColoniesQuery,
            UserColoniesQueryVariables
          >({
            query: UserColoniesDocument,
            variables: { address: walletAddress },
          });
          if (cacheData) {
            const existingColonies = cacheData.user.colonies || [];
            const colonies = [...existingColonies, data.createColony];
            cache.writeQuery<UserColoniesQuery, UserColoniesQueryVariables>({
              query: UserColoniesDocument,
              data: {
                user: {
                  ...cacheData.user,
                  colonies,
                },
              },
              variables: {
                address: walletAddress,
              },
            });
          }
        } catch (e) {
          log.verbose(e);
          log.verbose('Not updating store - user colonies not loaded yet');
        }
      }
    };
  },
  unsubscribeFromColony(colonyAddress: Address) {
    return (cache: Cache, { data }: UnsubscribeFromColonyMutationResult) => {
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
