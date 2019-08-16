/* eslint-disable max-len */

import BigNumber from 'bn.js';

import { TaskType, TaskProps } from '~immutable/index';
import { $Required, Address, AllEvents } from '~types/index';
import { Event } from '~data/types';
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

type TaskActionPayload<P> = TaskProps<'colonyAddress' | 'draftId'> & P;

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
  | TaskActionType<ActionTypes.TASK_CANCEL, object>
  | TaskErrorActionType<ActionTypes.TASK_CANCEL_ERROR>
  | TaskActionType<
      ActionTypes.TASK_CANCEL_SUCCESS,
      { event: Event<EventTypes.TASK_CANCELLED> }
    >
  | TaskActionType<ActionTypes.TASK_CLOSE, object>
  | TaskErrorActionType<ActionTypes.TASK_CLOSE_ERROR>
  | TaskActionType<
      ActionTypes.TASK_CLOSE_SUCCESS,
      { event: Event<EventTypes.TASK_CLOSED> }
    >
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
      TaskProps<'colonyAddress'>,
      object
    >
  | ErrorActionType<ActionTypes.TASK_CREATE_ERROR, object>
  | TaskActionType<
      ActionTypes.TASK_CREATE_SUCCESS,
      {
        colonyAddress: Address;
        commentsStoreAddress: string;
        taskStoreAddress: string;
        task: TaskProps<'colonyAddress' | 'creatorAddress' | 'draftId'>;
        event: Event<EventTypes.TASK_CREATED>;
      }
    >
  | NonUniqueTaskActionType<ActionTypes.TASK_FETCH, object>
  | TaskErrorActionType<ActionTypes.TASK_FETCH_ERROR>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_FETCH_SUCCESS,
      {
        colonyAddress: Address;
        task: TaskType;
      }
    >
  | ActionType<ActionTypes.TASK_FETCH_ALL>
  | NonUniqueTaskActionType<ActionTypes.TASK_FEED_ITEMS_SUB_START, object>
  | NonUniqueTaskActionType<ActionTypes.TASK_FEED_ITEMS_SUB_STOP, object>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_FEED_ITEMS_SUB_EVENTS,
      { events: AllEvents[] }
    >
  | TaskErrorActionType<ActionTypes.TASK_FEED_ITEMS_SUB_ERROR>
  | TaskActionType<
      ActionTypes.TASK_FINALIZE,
      $Required<TaskProps<'workerAddress'>> & {
        amountPaid: number;
      }
    >
  | TaskErrorActionType<ActionTypes.TASK_FINALIZE_ERROR>
  | TaskActionType<
      ActionTypes.TASK_FINALIZE_SUCCESS,
      { event: Event<EventTypes.TASK_FINALIZED> }
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
  | TaskActionType<ActionTypes.TASK_MODIFY_WORKER_PAYOUT, object>
  | TaskErrorActionType<ActionTypes.TASK_MODIFY_WORKER_PAYOUT_ERROR>
  | TaskActionType<ActionTypes.TASK_MODIFY_WORKER_PAYOUT_SUCCESS, object>
  | TaskActionType<ActionTypes.TASK_REMOVE_PAYOUT, object>
  | TaskErrorActionType<ActionTypes.TASK_REMOVE_PAYOUT_ERROR>
  | TaskActionType<
      ActionTypes.TASK_REMOVE_PAYOUT_SUCCESS,
      { event: Event<EventTypes.PAYOUT_REMOVED> }
    >
  | TaskActionType<
      ActionTypes.TASK_SEND_WORK_INVITE,
      TaskProps<'workerAddress'>
    >
  | TaskErrorActionType<ActionTypes.TASK_SEND_WORK_INVITE_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SEND_WORK_INVITE_SUCCESS,
      { event: Event<EventTypes.WORK_INVITE_SENT> }
    >
  | TaskActionType<ActionTypes.TASK_SEND_WORK_REQUEST, object>
  | TaskErrorActionType<ActionTypes.TASK_SEND_WORK_REQUEST_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SEND_WORK_REQUEST_SUCCESS,
      { event: Event<EventTypes.WORK_REQUEST_CREATED> }
    >
  | TaskActionType<ActionTypes.TASK_SET_DUE_DATE, TaskProps<'dueDate'>>
  | TaskErrorActionType<ActionTypes.TASK_SET_DUE_DATE_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_DUE_DATE_SUCCESS,
      { event: Event<EventTypes.DUE_DATE_SET> }
    >
  | TaskActionType<
      ActionTypes.TASK_SET_DESCRIPTION,
      $Required<TaskProps<'description'>>
    >
  | TaskErrorActionType<ActionTypes.TASK_SET_DESCRIPTION_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_DESCRIPTION_SUCCESS,
      { event: Event<EventTypes.TASK_DESCRIPTION_SET> }
    >
  | TaskActionType<
      ActionTypes.TASK_SET_DOMAIN,
      $Required<TaskProps<'domainId'>>
    >
  | TaskErrorActionType<ActionTypes.TASK_SET_DOMAIN_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_DOMAIN_SUCCESS,
      { event: Event<EventTypes.DOMAIN_SET> }
    >
  | TaskActionType<
      ActionTypes.TASK_SET_PAYOUT,
      { token: string; amount: BigNumber }
    >
  | TaskErrorActionType<ActionTypes.TASK_SET_PAYOUT_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_PAYOUT_SUCCESS,
      { event: Event<EventTypes.PAYOUT_SET> }
    >
  | TaskActionType<ActionTypes.TASK_SET_SKILL, TaskProps<'skillId'>>
  | TaskErrorActionType<ActionTypes.TASK_SET_SKILL_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_SKILL_SUCCESS,
      { event: Event<EventTypes.SKILL_SET> }
    >
  | TaskActionType<ActionTypes.TASK_SET_TITLE, $Required<TaskProps<'title'>>>
  | TaskErrorActionType<ActionTypes.TASK_SET_TITLE_ERROR>
  | TaskActionType<
      ActionTypes.TASK_SET_TITLE_SUCCESS,
      { event: Event<EventTypes.TASK_TITLE_SET> }
    >
  | NonUniqueTaskActionType<ActionTypes.TASK_SUB_START, object>
  | NonUniqueTaskActionType<ActionTypes.TASK_SUB_STOP, object>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_SUB_EVENTS,
      { events: AllEvents[] }
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
  | TaskActionType<
      ActionTypes.TASK_SET_WORKER_OR_PAYOUT_SUCCESS,
      {
        payouts?: { amount: BigNumber; token: string }[];
        workerAddress?: Address;
      }
    >
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE, object>
  | TaskErrorActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_ERROR>
  | TaskActionType<ActionTypes.TASK_SUBMIT_DELIVERABLE_SUCCESS, object>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_WORKER_ASSIGN,
      $Required<TaskProps<'workerAddress'>>
    >
  | TaskErrorActionType<ActionTypes.TASK_WORKER_ASSIGN_ERROR>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_WORKER_ASSIGN_SUCCESS,
      { event: Event<EventTypes.WORKER_ASSIGNED> }
    >
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
    >
  | NonUniqueTaskActionType<
      ActionTypes.TASK_WORKER_UNASSIGN,
      $Required<TaskProps<'workerAddress'>>
    >
  | TaskErrorActionType<ActionTypes.TASK_WORKER_UNASSIGN_ERROR>
  | NonUniqueTaskActionType<
      ActionTypes.TASK_WORKER_UNASSIGN_SUCCESS,
      { event: Event<EventTypes.WORKER_UNASSIGNED> }
    >;
