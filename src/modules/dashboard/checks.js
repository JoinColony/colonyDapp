/* @flow */

import type {
  ColonyType,
  TaskType,
  TokenReferenceType,
  TokenType,
  TaskUserType,
} from '~immutable';

import type { Address } from '~types';

import { ZERO_ADDRESS } from '~utils/web3/constants';
import { addressEquals } from '~utils/strings';
import { TASK_STATE } from '~immutable';

/*
 * Tokens
 */
export const tokenBalanceIsPositive = ({ balance }: TokenReferenceType) =>
  !!balance && balance.gten(0);

export const tokenBalanceIsNotPositive = ({ balance }: TokenReferenceType) =>
  !!balance && balance.lten(0);

export const tokenIsETH = ({ address }: TokenType | TokenReferenceType) =>
  address === ZERO_ADDRESS;

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
const didClaimPayout = (taskUser: ?TaskUserType, userAddress: string) =>
  taskUser &&
  taskUser.didClaimPayout &&
  addressEquals(taskUser.address, userAddress);

export const isManager = ({ managerAddress }: TaskType, userAddress: Address) =>
  addressEquals(managerAddress, userAddress);

export const isWorker = ({ workerAddress }: TaskType, userAddress: Address) =>
  addressEquals(workerAddress, userAddress);

export const isCreator = ({ creatorAddress }: TaskType, userAddress: Address) =>
  addressEquals(creatorAddress, userAddress);

export const isFinalized = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.FINALIZED;

export const isRating = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.RATING;

export const isActive = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.ACTIVE;

export const isReveal = ({ currentState }: TaskType) =>
  currentState === TASK_STATE.REVEAL;

export const didDueDateElapse = ({ dueDate }: TaskType) =>
  !!(dueDate && dueDate < new Date());

export const canEditTask = (task: TaskType, userAddress: Address) =>
  !!(isFinalized(task) && isCreator(task, userAddress));

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

export const canCancelTask = (task: TaskType, userAddress: Address) =>
  isManager(task, userAddress) && isActive(task);

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

/**
 * @todo Fix `canFinalizeTask` check.
 * @body Use a task property indicating that work has been submitted
 */
export const canFinalizeTask = (task: TaskType, userAddress: Address) =>
  isManager(task, userAddress) && isActive(task);
