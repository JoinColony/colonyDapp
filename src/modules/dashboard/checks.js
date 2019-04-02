/* @flow */

import type {
  ColonyType,
  NetworkProps,
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

export const canBeUpgraded = (colony: ?ColonyType, network: ?NetworkProps) =>
  colony &&
  colony.version &&
  network &&
  network.version &&
  network.version > colony.version;

/*
 * Tasks
 */
const didClaimPayout = (taskUser: ?TaskUserType, userAddress: string) =>
  taskUser &&
  taskUser.didClaimPayout &&
  addressEquals(taskUser.address, userAddress);

export const isManager = ({ manager }: TaskType, userAddress: Address) =>
  manager && manager.address && addressEquals(manager.address, userAddress);

export const isWorker = ({ worker }: TaskType, userAddress: Address) =>
  !!(worker && worker.address && addressEquals(worker.address, userAddress));

export const isCreator = ({ creatorAddress }: TaskType, userAddress: Address) =>
  addressEquals(creatorAddress, userAddress);

export const payoutCanBeClaimed = (
  { currentState, manager, worker }: TaskType,
  userAddress: Address,
) =>
  currentState === TASK_STATE.FINALIZED &&
  (didClaimPayout(worker, userAddress) || didClaimPayout(manager, userAddress));

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

// TODO fix this logic (why check didRate true??)
export const workerCanRateManager = (task: TaskType, userAddress: Address) =>
  isWorker(task, userAddress) &&
  isRating(task) &&
  task.worker &&
  task.worker.didRate;

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
    task.worker ||
    isCreator(task, userAddress) ||
    hasRequestedToWork(task, userAddress)
  );

// TODO use a task property indicating that work has been submitted
export const canFinalizeTask = (task: TaskType, userAddress: Address) =>
  isManager(task, userAddress) && isActive(task);
