/* eslint-disable max-len */
/* @flow */

import type { TaskType, TaskProps } from '~immutable';
import type { $Required, Address } from '~types';
import type { Event } from '~data/types';
import type {
  ActionType,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '~redux';
import type { TaskFeedItemEvents } from '../../../modules/dashboard/data/queries';

import { ACTIONS } from '~redux';
import { TASK_EVENT_TYPES } from '~data/constants';

const {
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

type TaskActionMeta = {|
  key: string, // draftId
|};

type TaskActionPayload<P> = {|
  ...TaskProps<{ draftId: * }>,
  ...P,
|};

type TaskActionType<T, P> = UniqueActionType<
  T,
  TaskActionPayload<P>,
  TaskActionMeta,
>;

type NonUniqueTaskActionType<T, P> = ActionTypeWithPayloadAndMeta<
  T,
  TaskActionPayload<P>,
  TaskActionMeta,
>;

type TaskErrorActionType<T> = ErrorActionType<T, TaskActionMeta>;

export type TaskActionTypes = {|
  TASK_CANCEL: TaskActionType<typeof ACTIONS.TASK_CANCEL, void>,
  TASK_CANCEL_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_CANCEL_ERROR>,
  TASK_CANCEL_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_CANCEL_SUCCESS,
    {| event: Event<typeof TASK_CANCELLED> |},
  >,
  TASK_CLOSE: TaskActionType<typeof ACTIONS.TASK_CLOSE, void>,
  TASK_CLOSE_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_CLOSE_ERROR>,
  TASK_CLOSE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_CLOSE_SUCCESS,
    {| event: Event<typeof TASK_CLOSED> |},
  >,
  TASK_COMMENT_ADD: TaskActionType<
    typeof ACTIONS.TASK_COMMENT_ADD,
    {| commentData: *, taskTitle: string |},
  >,
  TASK_COMMENT_ADD_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_ERROR,
  >,
  TASK_COMMENT_ADD_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS,
    {| event: Event<typeof COMMENT_POSTED> |},
  >,
  TASK_CREATE: UniqueActionType<
    typeof ACTIONS.TASK_CREATE,
    TaskProps<{ colonyAddress: * }>,
    void,
  >,
  TASK_CREATE_ERROR: ErrorActionType<typeof ACTIONS.TASK_CREATE_ERROR>,
  TASK_CREATE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_CREATE_SUCCESS,
    {|
      colonyAddress: Address,
      commentsStoreAddress: string,
      taskStoreAddress: string,
      task: TaskProps<{ colonyAddress: *, creatorAddress: *, draftId: * }>,
      event: Event<typeof TASK_CREATED>,
    |},
  >,
  TASK_FETCH: NonUniqueTaskActionType<typeof ACTIONS.TASK_FETCH, void>,
  TASK_FETCH_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_FETCH_ERROR>,
  TASK_FETCH_SUCCESS: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FETCH_SUCCESS,
    {|
      colonyAddress: Address,
      commentsStoreAddress: string,
      taskStoreAddress: string,
      task: $Shape<TaskType>,
    |},
  >,
  TASK_FETCH_ALL: ActionType<typeof ACTIONS.TASK_FETCH_ALL>,
  TASK_FEED_ITEMS_FETCH: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_FETCH,
    void,
  >,
  TASK_FEED_ITEMS_FETCH_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_FETCH_ERROR,
  >,
  TASK_FEED_ITEMS_FETCH_SUCCESS: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS,
    {| events: TaskFeedItemEvents[] |},
  >,
  TASK_FINALIZE: TaskActionType<
    typeof ACTIONS.TASK_FINALIZE,
    {| amountPaid: number, ...$Required<TaskProps<{ workerAddress: * }>> |},
  >,
  TASK_FINALIZE_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_FINALIZE_ERROR>,
  TASK_FINALIZE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_FINALIZE_SUCCESS,
    {| event: Event<typeof TASK_FINALIZED> |},
  >,
  TASK_MANAGER_COMPLETE: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE,
    void, // TODO define the payload
  >,
  TASK_MANAGER_COMPLETE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_ERROR,
  >,
  TASK_MANAGER_COMPLETE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_MANAGER_END: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_END,
    void, // TODO define the payload
  >,
  TASK_MANAGER_END_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_END_ERROR,
  >,
  TASK_MANAGER_END_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_END_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_MANAGER_RATE_WORKER: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER,
    void, // TODO define the payload
  >,
  TASK_MANAGER_RATE_WORKER_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR,
  >,
  TASK_MANAGER_RATE_WORKER_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING,
    void, // TODO define the payload
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_MODIFY_WORKER_PAYOUT: TaskActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT,
    void, // TODO define the payload
  >,
  TASK_MODIFY_WORKER_PAYOUT_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_ERROR,
  >,
  TASK_MODIFY_WORKER_PAYOUT_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_SEND_WORK_INVITE: TaskActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE,
    TaskProps<{ workerAddress: * }>,
  >,
  TASK_SEND_WORK_INVITE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_ERROR,
  >,
  TASK_SEND_WORK_INVITE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
    {| event: Event<typeof WORK_INVITE_SENT> |},
  >,
  TASK_SEND_WORK_REQUEST: TaskActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST,
    void, // the worker will be the wallet address from state
  >,
  TASK_SEND_WORK_REQUEST_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST_ERROR,
  >,
  TASK_SEND_WORK_REQUEST_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
    {| event: Event<typeof WORK_REQUEST_CREATED> |},
  >,
  TASK_SET_DUE_DATE: TaskActionType<
    typeof ACTIONS.TASK_SET_DUE_DATE,
    $Required<TaskProps<{ dueDate: * }>>,
  >,
  TASK_SET_DUE_DATE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_DUE_DATE_ERROR,
  >,
  TASK_SET_DUE_DATE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_DUE_DATE_SUCCESS,
    {| event: Event<typeof DUE_DATE_SET> |},
  >,
  TASK_SET_DESCRIPTION: TaskActionType<
    typeof ACTIONS.TASK_SET_DESCRIPTION,
    $Required<TaskProps<{ description: * }>>,
  >,
  TASK_SET_DESCRIPTION_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_DESCRIPTION_ERROR,
  >,
  TASK_SET_DESCRIPTION_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_DESCRIPTION_SUCCESS,
    {| event: Event<typeof TASK_DESCRIPTION_SET> |},
  >,
  TASK_SET_DOMAIN: TaskActionType<
    typeof ACTIONS.TASK_SET_DOMAIN,
    $Required<TaskProps<{ domainId: * }>>,
  >,
  TASK_SET_DOMAIN_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_DOMAIN_ERROR,
  >,
  TASK_SET_DOMAIN_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_DOMAIN_SUCCESS,
    {| event: Event<typeof DOMAIN_SET> |},
  >,
  TASK_SET_PAYOUT: TaskActionType<
    typeof ACTIONS.TASK_SET_PAYOUT,
    {| token: string, amount: string |},
  >,
  TASK_SET_PAYOUT_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_PAYOUT_ERROR,
  >,
  TASK_SET_PAYOUT_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_PAYOUT_SUCCESS,
    {| event: Event<typeof PAYOUT_SET> |},
  >,
  TASK_SET_SKILL: TaskActionType<
    typeof ACTIONS.TASK_SET_SKILL,
    $Required<TaskProps<{ skillId: * }>>,
  >,
  TASK_SET_SKILL_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_SKILL_ERROR,
  >,
  TASK_SET_SKILL_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_SKILL_SUCCESS,
    {| event: Event<typeof SKILL_SET> |},
  >,
  TASK_SET_TITLE: TaskActionType<
    typeof ACTIONS.TASK_SET_TITLE,
    $Required<TaskProps<{ title: * }>>,
  >,
  TASK_SET_TITLE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_TITLE_ERROR,
  >,
  TASK_SET_TITLE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_TITLE_SUCCESS,
    {| event: Event<typeof TASK_TITLE_SET> |},
  >,
  TASK_SUBMIT_DELIVERABLE: TaskActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE,
    void, // TODO define the payload
  >,
  TASK_SUBMIT_DELIVERABLE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_ERROR,
  >,
  TASK_SUBMIT_DELIVERABLE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_WORKER_ASSIGN: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN,
    $Required<TaskProps<{ workerAddress: * }>>,
  >,
  TASK_WORKER_ASSIGN_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN_ERROR,
  >,
  TASK_WORKER_ASSIGN_SUCCESS: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
    {| event: Event<typeof WORKER_ASSIGNED> |},
  >,
  TASK_WORKER_CLAIM_REWARD: TaskActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD,
    void, // TODO define the payload
  >,
  TASK_WORKER_CLAIM_REWARD_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR,
  >,
  TASK_WORKER_CLAIM_REWARD_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_WORKER_END: TaskActionType<
    typeof ACTIONS.TASK_WORKER_END,
    void, // TODO define the payload
  >,
  TASK_WORKER_END_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_END_ERROR,
  >,
  TASK_WORKER_END_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_END_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_WORKER_RATE_MANAGER: TaskActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER,
    void, // TODO define the payload
  >,
  TASK_WORKER_RATE_MANAGER_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR,
  >,
  TASK_WORKER_RATE_MANAGER_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING: TaskActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING,
    void, // TODO define the payload
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
    void, // TODO define the payload
  >,
  TASK_WORKER_UNASSIGN: TaskActionType<
    typeof ACTIONS.TASK_WORKER_UNASSIGN,
    $Required<TaskProps<{ workerAddress: * }>>,
  >,
  TASK_WORKER_UNASSIGN_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_UNASSIGN_ERROR,
  >,
  TASK_WORKER_UNASSIGN_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS,
    {| event: Event<typeof WORKER_UNASSIGNED> |},
  >,
|};
