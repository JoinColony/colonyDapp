/* @flow */

import type {
  ColonyType,
  NetworkProps,
  TaskType,
  TokenType,
  TaskUserType,
  TaskPayoutType,
} from '~immutable';

import type { Address } from '~types';

import { ZERO_ADDRESS } from '~utils/web3/constants';
import { addressEquals } from '~utils/strings';
import { TASK_STATE } from '~immutable';

/*
 * Tokens
 */
export const tokenBalanceIsPositive = ({ balance }: TokenType) =>
  !!balance && balance.gten(0);

export const tokenBalanceIsNotPositive = ({ balance }: TokenType) =>
  !!balance && balance.lten(0);

export const tokenIsETH = ({ address }: TokenType) => address === ZERO_ADDRESS;

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
const didClaimPayout = (taskUser: ?TaskUserType, address: string) =>
  taskUser &&
  taskUser.didClaimPayout &&
  addressEquals(taskUser.address, address);

export const isManager = ({ manager }: TaskType, address: Address) =>
  manager && manager.address && addressEquals(manager.address, address);

export const isWorker = ({ worker }: TaskType, address: Address) =>
  !!(worker && worker.address && addressEquals(worker.address, address));

export const isCreator = ({ creator }: TaskType, address: Address) =>
  addressEquals(creator, address);

export const payoutCanBeClaimed = (
  { currentState, manager, worker }: TaskType,
  address: Address,
) =>
  currentState === TASK_STATE.FINALIZED &&
  (didClaimPayout(worker, address) || didClaimPayout(manager, address));

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

export const taskCanBeEdited = (task: TaskType, address: Address) =>
  !!(isFinalized(task) && isCreator(task, address));

// TODO fix this logic (why check didRate true??)
export const workerCanRateManager = (task: TaskType, address: Address) =>
  isWorker(task, address) &&
  isRating(task) &&
  task.worker &&
  task.worker.didRate;

export const workerCanEndTask = (task: TaskType, address: Address) =>
  isWorker(task, address) && !(isRating(task) || didDueDateElapse(task));

export const workerCanRevealManagerRating = (
  task: TaskType,
  address: Address,
) => !!(isWorker(task, address) && isReveal(task));

// TODO check this logic (why no didRate false??)
export const managerCanRateWorker = (task: TaskType, address: Address) =>
  !!(isManager(task, address) && isRating(task));

export const managerCanEndTask = (task: TaskType, address: Address) =>
  !isRating(task) && isManager(task, address) && didDueDateElapse(task);

export const managerCanRevealWorkerRating = (
  task: TaskType,
  address: Address,
) => isManager(task, address) && isReveal(task);

export const canBeCancelled = (task: TaskType, address: Address) =>
  isManager(task, address) && isActive(task);

export const hasRequestedToWork = (
  { requests = [] }: TaskType,
  address: Address,
) => requests.find(requestAddress => requestAddress === address);

export const canRequestToWork = (task: TaskType, address: Address) =>
  !(
    task.worker ||
    isCreator(task, address) ||
    hasRequestedToWork(task, address)
  );

// TODO update this for the task payment workflow
export const canBeFinalized = ({ currentState, manager, worker }: TaskType) =>
  currentState === TASK_STATE.REVEAL &&
  manager &&
  manager.didRate &&
  worker &&
  worker.didRate;

/*
 * Task payouts
 */

const NETWORK_FEE = 0.01;

export const getTaskPayoutNetworkFee = ({ amount }: TaskPayoutType) =>
  amount * NETWORK_FEE;

export const getTaskPayoutAmountMinusNetworkFee = (payout: TaskPayoutType) =>
  payout.amount - getTaskPayoutNetworkFee(payout);
