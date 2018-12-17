/* @flow */

import ColonyNetworkClient from '@colony/colony-js-client';
import type { PermissionsManifest } from './types';

const ROLES = Object.freeze({
  COLONY: Object.freeze({
    FOUNDER: 0,
    ADMIN: 1,
  }),
  TASK: Object.freeze({
    MANAGER: 0,
    EVALUATOR: 1,
    WORKER: 2,
  }),
});

type COLONY_ROLES = $Values<$PropertyType<typeof ROLES, 'COLONY'>>;
type TASK_ROLES = $Values<$PropertyType<typeof ROLES, 'TASK'>>;

const isAny = (...promises): Promise<boolean> =>
  Promise.all(promises).then(values => values.some(value => !!value));

const makeUserHasRoleFn = (
  colonyClient: ColonyNetworkClient.ColonyClient,
  colonyRole: COLONY_ROLES,
) => (user: string): Promise<boolean> =>
  colonyClient.hasUserRole.call({ user, role: colonyRole });

const makeUserTaskAssignedRoleFn = (
  colonyClient: ColonyNetworkClient.ColonyClient,
  taskRole: TASK_ROLES,
) => (user: string, { taskId }: { taskId: string }): Promise<boolean> =>
  colonyClient.getTaskRole
    .call({
      taskId,
      role: taskRole,
    })
    .then(({ address }) => address === user);

export default function loadModule(
  colonyClient: ColonyNetworkClient.ColonyClient,
): PermissionsManifest {
  const isColonyAdmin = makeUserHasRoleFn(colonyClient, ROLES.COLONY.ADMIN);
  const isColonyFounder = makeUserHasRoleFn(colonyClient, ROLES.COLONY.FOUNDER);

  const isTaskManager = makeUserTaskAssignedRoleFn(
    colonyClient,
    ROLES.TASK.MANAGER,
  );
  const isTaskEvaluator = makeUserTaskAssignedRoleFn(
    colonyClient,
    ROLES.TASK.EVALUATOR,
  );
  const isTaskWorker = makeUserTaskAssignedRoleFn(
    colonyClient,
    ROLES.TASK.WORKER,
  );

  return {
    'is-colony-admin': isColonyAdmin,
    'is-colony-founder': isColonyFounder,
    'is-colony-founder-or-admin': user =>
      isAny(isColonyAdmin(user), isColonyFounder(user)),
    'is-task-manager': isTaskManager,
    'is-task-evaluator': isTaskEvaluator,
    'is-task-worker': isTaskWorker,
    'is-task-manager-or-evaluator': (user, context) =>
      isAny(isTaskManager(user, context), isTaskEvaluator(user, context)),
    'is-task-manager-or-worker': (user, context) =>
      isAny(isTaskManager(user, context), isTaskWorker(user, context)),
  };
}
