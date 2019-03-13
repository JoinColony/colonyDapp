/* @flow */

import type { TaskPayoutType, TaskPayoutRecordType } from '../TaskPayout';
import type { TaskType } from '../Task';
import { TASK_STATE } from '~immutable/constants';
import type { TaskUserType } from '~immutable/TaskUser';

const NETWORK_FEE = 0.01;

export const getTaskPayoutNetworkFee = ({
  amount,
}: TaskPayoutType | TaskPayoutRecordType) => amount * NETWORK_FEE;

export const getTaskPayoutAmountMinusNetworkFee = (
  payout: TaskPayoutType | TaskPayoutRecordType,
) => payout.amount - getTaskPayoutNetworkFee(payout);

const isTaskUser = (taskUser: ?TaskUserType, address: string) =>
  taskUser &&
  taskUser.address &&
  taskUser.address.toLowerCase() === address.toLowerCase();

export const isTaskWorker = ({ worker }: TaskType, address: string) =>
  isTaskUser(worker, address);

export const isTaskManager = ({ manager }: TaskType, address: string) =>
  isTaskUser(manager, address);

export const didTaskDueDateElapse = ({ dueDate }: TaskType) =>
  !!dueDate && dueDate < new Date();

export const canTaskPayoutBeClaimed = (task: TaskType, address: string) =>
  (task.currentState === TASK_STATE.FINALIZED &&
    (isTaskWorker(task, address) &&
      task.worker &&
      task.worker.didClaimPayout)) ||
  (isTaskManager(task, address) && task.manager && task.manager.didClaimPayout);

// TODO update this for the task payments workflow
export const canTaskBeFinalized = ({
  currentState,
  manager,
  worker,
}: TaskType) =>
  currentState === TASK_STATE.REVEAL &&
  manager &&
  manager.didRate &&
  worker &&
  worker.didRate;
