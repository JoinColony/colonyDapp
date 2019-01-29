/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import {
  ADMIN_ROLE,
  AUTHORITY_ROLES,
  EVALUATOR_ROLE,
  FOUNDER_ROLE,
  MANAGER_ROLE,
  ROLES,
  WORKER_ROLE,
} from '@colony/colony-js-client';

import type { PermissionsManifest } from './types';

type AuthorityRole = $Keys<typeof AUTHORITY_ROLES>;
type Role = $Keys<typeof ROLES>;

const isAny = (...promises): Promise<boolean> =>
  Promise.all(promises).then(values => values.some(value => !!value));

const makeUserHasRoleFn = (
  colonyClient: ColonyClientType,
  role: AuthorityRole,
) => async (user: string): Promise<boolean> => {
  const { hasRole } = await colonyClient.hasUserRole.call({ user, role });
  return hasRole;
};

const makeUserTaskAssignedRoleFn = (
  colonyClient: ColonyClientType,
  role: Role,
) => async (user: string, { taskId }: { taskId: number }) => {
  const { address } = await colonyClient.getTaskRole.call({
    taskId,
    role,
  });
  return address === user;
};

export default function loadModule(
  colonyClient: ColonyClientType,
): PermissionsManifest {
  const isColonyAdmin = makeUserHasRoleFn(colonyClient, ADMIN_ROLE);
  const isColonyFounder = makeUserHasRoleFn(colonyClient, FOUNDER_ROLE);

  const isTaskManager = makeUserTaskAssignedRoleFn(colonyClient, MANAGER_ROLE);
  const isTaskEvaluator = makeUserTaskAssignedRoleFn(
    colonyClient,
    EVALUATOR_ROLE,
  );
  const isTaskWorker = makeUserTaskAssignedRoleFn(colonyClient, WORKER_ROLE);

  return {
    'is-colony-admin': isColonyAdmin,
    'is-colony-founder': isColonyFounder,
    'is-colony-founder-or-admin': user =>
      isAny(isColonyAdmin(user), isColonyFounder(user)),
    'is-task-manager': isTaskManager,
    'is-task-evaluator': isTaskEvaluator,
    'is-task-worker': isTaskWorker,
    'is-assigned-to-task': (user, context) =>
      isAny(
        isTaskWorker(user, context),
        isTaskManager(user, context),
        isTaskEvaluator(user, context),
      ),
    'is-task-manager-or-evaluator': (user, context) =>
      isAny(isTaskManager(user, context), isTaskEvaluator(user, context)),
    'is-task-manager-or-worker': (user, context) =>
      isAny(isTaskManager(user, context), isTaskWorker(user, context)),
  };
}
