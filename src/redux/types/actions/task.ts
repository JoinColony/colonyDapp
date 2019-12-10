/* eslint-disable max-len */

import BigNumber from 'bn.js';
import { CommentEvents } from '~data/types/CommentEvents';
import { TaskEvents } from '~data/types/TaskEvents';

import { Address, CurrentEvents } from '~types/index';
import { Event, Task, TaskProps } from '~data/types';
import {
  ActionTypes,
  ActionType,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '~redux/index';
import { EventTypes } from '~data/constants';

type TaskActionMeta = {
  key: string; // draftId
};

type TaskActionPayload<P> = TaskProps<'id'> & P;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskActionType<T extends string, P>
  extends UniqueActionType<T, TaskActionPayload<P>, TaskActionMeta> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NonUniqueTaskActionType<T extends string, P>
  extends ActionTypeWithPayloadAndMeta<
    T,
    TaskActionPayload<P>,
    TaskActionMeta
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TaskErrorActionType<T extends string>
  extends ErrorActionType<T, TaskActionMeta> {}

/**
 * @todo Define missing task action payload types.
 * @body These are:
 * TASK_MANAGER_COMPLETE
 * TASK_MANAGER_COMPLETE_SUCCESS
 * TASK_MANAGER_END
 * TASK_MANAGER_END_SUCCESS
 * TASK_MANAGER_RATE_WORKER
 * TASK_MANAGER_RATE_WORKER_SUCCESS
 * TASK_MANAGER_REVEAL_WORKER_RATING
 * TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS
 * TASK_MODIFY_WORKER_PAYOUT
 * TASK_MODIFY_WORKER_PAYOUT_SUCCESS
 * TASK_SUBMIT_DELIVERABLE
 * TASK_SUBMIT_DELIVERABLE_SUCCESS
 * TASK_WORKER_CLAIM_REWARD
 * TASK_WORKER_CLAIM_REWARD_SUCCESS
 * TASK_WORKER_END
 * TASK_WORKER_END_SUCCESS
 * TASK_WORKER_RATE_MANAGER
 * TASK_WORKER_RATE_MANAGER_SUCCESS
 * TASK_WORKER_REVEAL_MANAGER_RATING
 * TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS
 */
export type TaskActionTypes =
  | TaskActionType<
      ActionTypes.TASK_COMMENT_ADD,
      {
        comment: string;
        author: Address;
        draftIt: string;
        colonyAddress: Address;
        taskTitle: string;
      }
    >
  | TaskErrorActionType<ActionTypes.TASK_COMMENT_ADD_ERROR>
  | TaskActionType<
      ActionTypes.TASK_COMMENT_ADD_SUCCESS,
      { event: Event<EventTypes.COMMENT_POSTED> }
    >
  | UniqueActionType<
      ActionTypes.TASK_CREATE,
      TaskProps<'ethDomainId'> & { colonyAddress: Address },
      object
    >
  | ErrorActionType<ActionTypes.TASK_CREATE_ERROR, object>
  | TaskActionType<
      ActionTypes.TASK_CREATE_SUCCESS,
      {
        colonyAddress: Address;
        task: TaskProps<'id' | 'ethDomainId'>;
      }
    >
  | NonUniqueTaskActionType<ActionTypes.TASK_FETCH, object>
  | TaskErrorActionType<ActionTypes.TASK_FETCH_ERROR>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_FETCH_SUCCESS,
      {
        colonyAddress: Address;
        task: Task;
      }
    >
  | ActionType<ActionTypes.TASK_FETCH_ALL>
  | NonUniqueTaskActionType<ActionTypes.TASK_FEED_ITEMS_SUB_START, object>
  | NonUniqueTaskActionType<ActionTypes.TASK_FEED_ITEMS_SUB_STOP, object>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_FEED_ITEMS_SUB_EVENTS,
      { events: CurrentEvents<TaskEvents | CommentEvents>[] }
    >
  | TaskErrorActionType<ActionTypes.TASK_FEED_ITEMS_SUB_ERROR>
  | TaskActionType<
      ActionTypes.TASK_FINALIZE,
      Required<TaskProps<'assignedWorker'>> & {
        amountPaid: number;
      }
    >
  | TaskErrorActionType<ActionTypes.TASK_FINALIZE_ERROR>
  | ActionType<
      ActionTypes.TASK_FINALIZE_SUCCESS
    >
  | TaskActionType<ActionTypes.TASK_MANAGER_COMPLETE, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_COMPLETE_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_COMPLETE_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_END, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_END_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_END_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_RATE_WORKER, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_RATE_WORKER_ERROR>
  | TaskActionType<ActionTypes.TASK_MANAGER_RATE_WORKER_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING, object>
  | TaskErrorActionType<ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR>
  | TaskActionType<
      ActionTypes.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
      object
    >
  | TaskActionType<ActionTypes.TASK_SEND_WORK_REQUEST, object>
  | TaskErrorActionType<ActionTypes.TASK_SEND_WORK_REQUEST_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SEND_WORK_REQUEST_SUCCESS,
      { event: Event<EventTypes.WORK_REQUEST_CREATED> }
    >
  | NonUniqueTaskActionType<ActionTypes.TASK_SUB_START, object>
  | NonUniqueTaskActionType<ActionTypes.TASK_SUB_STOP, object>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_SUB_EVENTS,
      { events: CurrentEvents<TaskEvents>[] }
    >
  | TaskErrorActionType<ActionTypes.TASK_SUB_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_WORKER_OR_PAYOUT,
      {
        payouts?: { token: string; amount: BigNumber }[];
        workerAddress?: Address;
      }
    >
  | TaskErrorActionType<ActionTypes.TASK_SET_WORKER_OR_PAYOUT_ERROR>
  | ActionType<
      ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS
    >
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE, object>
  | TaskErrorActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_ERROR>
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_CLAIM_REWARD_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_END, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_END_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_END_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_RATE_MANAGER, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_RATE_MANAGER_ERROR>
  | TaskActionType<ActionTypes.TASK_WORKER_RATE_MANAGER_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING, object>
  | TaskErrorActionType<ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR>
  | TaskActionType<
      ActionTypes.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
      object
    >;
