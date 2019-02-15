/* eslint-disable max-len */
/* @flow */

import type { TaskType, TaskProps } from '~immutable';
import type { $Required } from '~types';
import type {
  ActionType,
  ActionTypeWithPayload,
  ErrorActionType,
  UniqueActionType,
} from '~redux';
import type { Event } from '../../../data/types';

import { ACTIONS } from '~redux';

type TaskActionMeta = {|
  keyPath: [string], // draftId
|};

type TaskActionType<T, P> = UniqueActionType<
  T,
  {|
    colonyENSName: string,
    draftId: string,
    ...P,
  |},
  TaskActionMeta,
>;

type TaskErrorActionType<T> = ErrorActionType<T, TaskActionMeta>;

export type TaskActionTypes = {|
  TASK_ASSIGN: TaskActionType<typeof ACTIONS.TASK_ASSIGN, {| worker: string |}>,
  TASK_ASSIGN_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_ASSIGN_ERROR>,
  TASK_ASSIGN_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_ASSIGN_SUCCESS,
    {| worker: string |},
  >,
  TASK_CANCEL: TaskActionType<typeof ACTIONS.TASK_CANCEL, void>,
  TASK_CANCEL_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_CANCEL_ERROR>,
  TASK_CANCEL_SUCCESS: TaskActionType<typeof ACTIONS.TASK_CANCEL_SUCCESS, void>,
  TASK_CLOSE: TaskActionType<typeof ACTIONS.TASK_CLOSE, void>,
  TASK_CLOSE_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_CLOSE_ERROR>,
  TASK_CLOSE_SUCCESS: TaskActionType<typeof ACTIONS.TASK_CLOSE_SUCCESS, void>,
  TASK_COMMENT_ADD: TaskActionType<
    typeof ACTIONS.TASK_COMMENT_ADD,
    {| commentData: * |},
  >,
  TASK_COMMENT_ADD_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_ERROR,
  >,
  TASK_COMMENT_ADD_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS,
    {| commentData: *, signature: * |},
  >,
  TASK_CREATE: UniqueActionType<
    typeof ACTIONS.TASK_CREATE,
    TaskProps<{ colonyENSName: * }>,
    void,
  >,
  TASK_CREATE_ERROR: ErrorActionType<typeof ACTIONS.TASK_CREATE_ERROR>,
  TASK_CREATE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_CREATE_SUCCESS,
    {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
      task: TaskProps<{ colonyENSName: *, draftId: * }>,
    |},
  >,
  TASK_FETCH: TaskActionType<typeof ACTIONS.TASK_FETCH, void>,
  TASK_FETCH_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_FETCH_ERROR>,
  TASK_FETCH_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_FETCH_SUCCESS,
    {|
      commentsStoreAddress: string,
      taskStoreAddress: string,
      task: $Shape<TaskType>,
    |},
  >,
  TASK_FETCH_ALL: ActionType<typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY>,
  TASK_FETCH_ALL_FOR_COLONY: ActionTypeWithPayload<
    typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY,
    TaskProps<{ colonyENSName: * }>,
  >,
  TASK_FETCH_ALL_FOR_COLONY_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY_ERROR,
    void,
  >,
  TASK_FETCH_ALL_FOR_COLONY_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.TASK_FETCH_ALL_FOR_COLONY_SUCCESS,
    {|
      ...TaskProps<{ colonyENSName: * }>,
      colonyTasks: {
        [draftId: string]: {|
          commentsStoreAddress: string,
          taskStoreAddress: string,
        |},
      },
    |},
  >,
  TASK_FETCH_COMMENTS: TaskActionType<typeof ACTIONS.TASK_FETCH_COMMENTS, void>,
  TASK_FETCH_COMMENTS_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS_ERROR,
  >,
  TASK_FETCH_COMMENTS_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS_SUCCESS,
    {| comments: $ElementType<Event<'COMMENT_POSTED'>, 'payload'>[] |}, // todo use constant
  >,
  TASK_FETCH_IDS_FOR_CURRENT_USER: ActionType<
    typeof ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER,
  >,
  TASK_FETCH_IDS_FOR_CURRENT_USER_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_ERROR,
    void,
  >,
  TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS: ActionTypeWithPayload<
    typeof ACTIONS.TASK_FETCH_IDS_FOR_CURRENT_USER_SUCCESS,
    string[],
  >,
  TASK_FINALIZE: TaskActionType<
    typeof ACTIONS.TASK_FINALIZE,
    {| amountPaid: number, ...TaskProps<{ worker: * }> |},
  >,
  TASK_FINALIZE_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_FINALIZE_ERROR>,
  TASK_FINALIZE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_FINALIZE_SUCCESS,
    {| amountPaid: number, ...TaskProps<{ worker: * }> |},
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
    {| worker: string |},
  >,
  TASK_SEND_WORK_INVITE_ERROR: TaskErrorActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_ERROR,
  >,
  TASK_SEND_WORK_INVITE_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
    {| worker: string |},
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
    {| worker: string |},
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
    $Required<TaskProps<{ dueDate: * }>>,
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
    $Required<TaskProps<{ description: * }>>,
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
    $Required<TaskProps<{ domainId: * }>>,
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
    {| token: string, amount: string |},
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
    $Required<TaskProps<{ skillId: * }>>,
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
    $Required<TaskProps<{ title: * }>>,
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
  TASK_UNASSIGN: TaskActionType<
    typeof ACTIONS.TASK_UNASSIGN,
    {| worker: string |},
  >,
  TASK_UNASSIGN_ERROR: TaskErrorActionType<typeof ACTIONS.TASK_UNASSIGN_ERROR>,
  TASK_UNASSIGN_SUCCESS: TaskActionType<
    typeof ACTIONS.TASK_UNASSIGN_SUCCESS,
    {| worker: string |},
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
  TASK_WORKER_ASSIGN: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
      workDescription: *,
      rating: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_WORKER_ASSIGN_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_ASSIGN_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_ASSIGN_SUCCESS,
    void,
    WithKeyPathDepth2,
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
|};
