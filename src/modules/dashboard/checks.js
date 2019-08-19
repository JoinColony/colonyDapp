/* @flow */

import type {
  ColonyType,
  TaskType,
  TaskUserType,
  UserPermissionsType,
} from '~immutable';

import type { Address } from '~types';

import { TASK_STATE } from '~immutable';

/*
 * Colony
 */
export const isInRecoveryMode = (colony: ?ColonyType) =>
  !!(colony && colony.inRecoveryMode);

export const canBeUpgraded = (colony: ?ColonyType, networkVersion: ?number) =>
  colony && colony.version && networkVersion && networkVersion > colony.version;

/*
 * Tasks
 */
/**
 * @todo Wire task payouts.
 */
// eslint-disable-next-line no-unused-vars
const didClaimPayout = (taskUser: ?TaskUserType, userAddress: Address) =>
  taskUser && taskUser.didClaimPayout && taskUser.address === userAddress;

export const isManager = ({ managerAddress }: TaskType, userAddress: Address) =>
  managerAddress === userAddress;

export const isWorker = ({ workerAddress }: TaskType, userAddress: Address) =>
  workerAddress === userAddress;

export const isCreator = ({ creatorAddress }: TaskType, userAddress: Address) =>
  creatorAddress === userAddress;

export const isFounder = (permissions: ?UserPermissionsType) =>
  permissions && permissions.isFounder;

export const isAdmin = (permissions: ?UserPermissionsType) =>
  permissions && permissions.isAdmin;

export const isPayoutsSet = ({ payouts }: TaskType) =>
  !!payouts && payouts.length > 0;

export const isFinalized = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.FINALIZED;

export const isCancelled = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.CANCELLED;

export const isRating = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.RATING;

export const isActive = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.ACTIVE;

export const isReveal = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.REVEAL;

export const didDueDateElapse = ({ dueDate }: TaskType) =>
  !!(dueDate && dueDate < new Date());

export const isWorkerSet = ({ workerAddress }: TaskType) => !!workerAddress;

export const canEditTask = (
  task: TaskType,
  permissions: ?UserPermissionsType,
  userAddress: Address,
) =>
  !isFinalized(task) &&
  !isCancelled(task) &&
  (isCreator(task, userAddress) ||
    isFounder(permissions) ||
    isAdmin(permissions));

export const isDomainSet = ({ domainId }: TaskType) => !!domainId;

export const isSkillSet = ({ skillId }: TaskType) => !!skillId;

/**
 * @todo Fix task rating checks logic.
 * @body Fix this logic in #169
 */
// eslint-disable-next-line no-unused-vars
export const workerCanRateManager = (task: TaskType, userAddress: Address) =>
  false;

export const workerCanEndTask = (task: TaskType, userAddress: Address) =>
  isWorker(task, userAddress) && !(isRating(task) || didDueDateElapse(task));

export const workerCanRevealManagerRating = (
  task: TaskType,
  userAddress: Address,
) => !!(isWorker(task, userAddress) && isReveal(task));

export const managerCanRateWorker = (task: TaskType, userAddress: Address) =>
  !!(isManager(task, userAddress) && isRating(task));

export const managerCanEndTask = (task: TaskType, userAddress: Address) =>
  !isRating(task) && isManager(task, userAddress) && didDueDateElapse(task);

export const managerCanRevealWorkerRating = (
  task: TaskType,
  userAddress: Address,
) => isManager(task, userAddress) && isReveal(task);

export const canCancelTask = (
  task: TaskType,
  permissions: ?UserPermissionsType,
  userAddress: Address,
) =>
  isActive(task) &&
  (isManager(task, userAddress) ||
    isFounder(permissions) ||
    isAdmin(permissions));

export const hasRequestedToWork = (
  { requests = [] }: TaskType,
  userAddress: Address,
) => requests.find(requestAddress => requestAddress === userAddress);

export const canRequestToWork = (task: TaskType, userAddress: Address) =>
  !(
    task.workerAddress ||
    isCreator(task, userAddress) ||
    hasRequestedToWork(task, userAddress)
  );

export const canFinalizeTask = (
  task: TaskType,
  permissions: ?UserPermissionsType,
  userAddress: Address,
) =>
  task &&
  isActive(task) &&
  isWorkerSet(task) &&
  isDomainSet(task) &&
  isPayoutsSet(task) &&
  (isManager(task, userAddress) ||
    isFounder(permissions) ||
    isAdmin(permissions));
