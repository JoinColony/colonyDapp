/* eslint-disable max-len */
/* @flow */
import type BigNumber from 'bn.js';

import type { TaskType, TaskProps } from '~immutable';
import type { $Required, Address } from '~types';
import type { Event } from '~data/types';
import type { TaskEvents } from '~data/types/TaskEvents';
import type {
  ActionType,
  ActionTypeWithPayloadAndMeta,
  ErrorActionType,
  UniqueActionType,
} from '~redux';
import type { AllTaskEvents } from '../../../modules/dashboard/data/queries';

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
  ...TaskProps<{ colonyAddress: *, draftId: * }>,
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
    {|
      comment: string,
      author: string,
      draftIt: string,
      colonyAddress: Address,
      taskTitle: string,
    |},
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
      task: $Shape<TaskType>,
    |},
  >,
  TASK_FETCH_ALL: ActionType<typeof ACTIONS.TASK_FETCH_ALL>,
  TASK_FEED_ITEMS_SUB_START: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_SUB_START,
    void,
  >,
  TASK_FEED_ITEMS_SUB_STOP: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_SUB_STOP,
    void,
  >,
  TASK_FEED_ITEMS_SUB_EVENTS: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_SUB_EVENTS,
    {| events: AllTaskEvents[] |},
  >,
  TASK_FEED_ITEMS_SUB_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_FEED_ITEMS_SUB_ERROR,
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
    void,
  >,
  TASK_MANAGER_COMPLETE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_ERROR,
  >,
  TASK_MANAGER_COMPLETE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_SUCCESS,
    void,
  >,
  TASK_MANAGER_END: TaskActionType<typeof ACTIONS.TASK_MANAGER_END, void>,
  TASK_MANAGER_END_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_END_ERROR,
  >,
  TASK_MANAGER_END_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_END_SUCCESS,
    void,
  >,
  TASK_MANAGER_RATE_WORKER: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER,
    void,
  >,
  TASK_MANAGER_RATE_WORKER_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR,
  >,
  TASK_MANAGER_RATE_WORKER_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
    void,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING,
    void,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
    void,
  >,
  TASK_MODIFY_WORKER_PAYOUT: TaskActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT,
    void,
  >,
  TASK_MODIFY_WORKER_PAYOUT_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_ERROR,
  >,
  TASK_MODIFY_WORKER_PAYOUT_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_SUCCESS,
    void,
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
    TaskProps<{ dueDate: * }>,
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
    {| token: string, amount: BigNumber |},
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
    TaskProps<{ skillId: * }>,
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
  TASK_SUB_START: NonUniqueTaskActionType<typeof ACTIONS.TASK_SUB_START, void>,
  TASK_SUB_STOP: NonUniqueTaskActionType<typeof ACTIONS.TASK_SUB_STOP, void>,
  TASK_SUB_EVENTS: NonUniqueTaskActionType<
    typeof ACTIONS.TASK_SUB_EVENTS,
    {| events: $Values<TaskEvents>[] |},
  >,
  TASK_SUB_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_SUB_ERROR>,
  TASK_SET_WORKER_OR_PAYOUT: TaskActionType<
    typeof ACTIONS.TASK_SET_WORKER_OR_PAYOUT,
    {|
      payouts?: Array<{| token: string, amount: BigNumber |}>,
      workerAddress?: Address,
    |},
  >,
  TASK_SET_WORKER_OR_PAYOUT_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SET_WORKER_OR_PAYOUT_ERROR,
  >,
  TASK_SET_WORKER_OR_PAYOUT_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SET_WORKER_OR_PAYOUT_SUCCESS,
    {|
      payouts?: Array<{| amount: BigNumber, token: string |}>,
      workerAddress?: Address,
    |},
  >,
  TASK_SUBMIT_DELIVERABLE: TaskActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE,
    void,
  >,
  TASK_SUBMIT_DELIVERABLE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_ERROR,
  >,
  TASK_SUBMIT_DELIVERABLE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_SUCCESS,
    void,
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
    void,
  >,
  TASK_WORKER_CLAIM_REWARD_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR,
  >,
  TASK_WORKER_CLAIM_REWARD_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS,
    void,
  >,
  TASK_WORKER_END: TaskActionType<typeof ACTIONS.TASK_WORKER_END, void>,
  TASK_WORKER_END_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_END_ERROR,
  >,
  TASK_WORKER_END_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_END_SUCCESS,
    void,
  >,
  TASK_WORKER_RATE_MANAGER: TaskActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER,
    void,
  >,
  TASK_WORKER_RATE_MANAGER_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR,
  >,
  TASK_WORKER_RATE_MANAGER_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS,
    void,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING: TaskActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING,
    void,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
    void,
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
