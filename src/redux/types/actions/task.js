/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import type { WithKeyPathDepth2 } from '~types';
// import type { TaskType } from '~immutable';

import type { ErrorActionType, UniqueActionType } from '../index';

import { ACTIONS } from '../../index';

export type TaskActionTypes = {|
  TASK_CANCEL: UniqueActionType<
    typeof ACTIONS.TASK_CANCEL,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_CANCEL_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_CANCEL_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_CANCEL_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_CANCEL_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_CLOSE: UniqueActionType<typeof ACTIONS.TASK_CLOSE, *, WithKeyPathDepth2>,
  TASK_CLOSE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_CLOSE_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_CLOSE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_CLOSE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_COMMENT_ADD: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD,
    {| taskId: string, commentsStoreAddress: string, commentData: * |},
    void,
  >,
  TASK_COMMENT_ADD_ERROR: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_ERROR,
    void,
  >,
  TASK_COMMENT_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS,
    {|
      taskId: string,
      commentsStoreAddress: string,
      commentData: *,
      signature: string,
    |},
    void,
  >,
  TASK_COMMENTS_GET: UniqueActionType<
    typeof ACTIONS.TASK_COMMENTS_GET,
    void,
    WithKeyPathDepth2,
  >,
  TASK_COMMENTS_GET_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_COMMENTS_GET_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_COMMENTS_GET_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_COMMENTS_GET_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_CREATE: UniqueActionType<
    typeof ACTIONS.TASK_CREATE,
    {|
      colonyENSName: string,
      bounty: string,
      domainId: number,
      dueDate: Date,
      skillId: number,
      description: string,
      user: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_CREATE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_CREATE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_CREATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_CREATE_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_FETCH: UniqueActionType<typeof ACTIONS.TASK_FETCH, *, WithKeyPathDepth2>,
  // @TODO: Move to colony actions
  COLONY_FETCH_TASKS: UniqueActionType<
    typeof ACTIONS.COLONY_FETCH_TASKS,
    void,
    WithKeyPathDepth2,
  >,
  COLONY_FETCH_TASKS_SUCCESS: UniqueActionType<
    typeof ACTIONS.COLONY_FETCH_TASKS_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  COLONY_FETCH_TASKS_ERROR: UniqueActionType<
    typeof ACTIONS.COLONY_FETCH_TASKS_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_FETCH_COMMENTS: UniqueActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_FETCH_COMMENTS_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_FETCH_COMMENTS_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_FETCH_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_FETCH_SUCCESS,
    *,
    WithKeyPathDepth2,
  >,
  TASK_FINALIZE: UniqueActionType<
    typeof ACTIONS.TASK_FINALIZE,
    {|
      taskId: number,
      taskStoreAddress: string,
      colonyENSName: string,
      worker: string,
      amountPaid: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_FINALIZE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_FINALIZE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_FINALIZE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_FINALIZE_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_COMPLETE: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_COMPLETE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_COMPLETE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_COMPLETE_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_END: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_END,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
      rating: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_END_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_MANAGER_END_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_END_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_END_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_RATE_WORKER: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
      rating: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_RATE_WORKER_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_RATE_WORKER_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_RATE_WORKER_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_MANAGER_REVEAL_WORKER_RATING_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_MODIFY_WORKER_PAYOUT: UniqueActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT,
    {|
      taskId: number, // TODO should be draftId
      fromPot: number,
      toPot: number,
      amount: number,
      token: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_MODIFY_WORKER_PAYOUT_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_MODIFY_WORKER_PAYOUT_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_MODIFY_WORKER_PAYOUT_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_SET_DATE: UniqueActionType<
    typeof ACTIONS.TASK_SET_DATE,
    {|
      colonyENSName: string,
      dueDate: Date,
      taskId: number,
      taskStoreAddress: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SET_DATE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SET_DATE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SET_DATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SET_DATE_SUCCESS,
    {
      eventData: $PropertyType<
        $PropertyType<ColonyClientType, 'events'>,
        'TaskDomainSet',
      >,
    },
    WithKeyPathDepth2,
  >,
  TASK_SET_DOMAIN: UniqueActionType<
    typeof ACTIONS.TASK_SET_DOMAIN,
    {|
      colonyENSName: string,
      domainId: Date,
      taskId: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SET_DOMAIN_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SET_DOMAIN_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SET_DOMAIN_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SET_DOMAIN_SUCCESS,
    {
      eventData: $PropertyType<
        $PropertyType<ColonyClientType, 'events'>,
        'TaskDueDateSet',
      >,
    },
    WithKeyPathDepth2,
  >,
  TASK_SET_SKILL: UniqueActionType<
    typeof ACTIONS.TASK_SET_SKILL,
    {|
      taskId: string, // TODO should be draftId
      skillId: number,
      colonyENSName: string,
      taskStoreAddress: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SET_SKILL_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SET_SKILL_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SET_SKILL_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SET_SKILL_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_SET_PAYOUT: UniqueActionType<
    typeof ACTIONS.TASK_SET_PAYOUT,
    {|
      taskId: string,
      colonyENSName: string,
      taskStoreAddress: string,
      amount: string,
      token?: ?string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SET_PAYOUT_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SET_PAYOUT_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SET_PAYOUT_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SET_PAYOUT_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_ASSIGN: UniqueActionType<
    typeof ACTIONS.TASK_ASSIGN,
    {|
      taskId: string,
      taskStoreAddress: string,
      colonyENSName: string,
      worker: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_ASSIGN_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_ASSIGN_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_ASSIGN_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_ASSIGN_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_UNASSIGN: UniqueActionType<
    typeof ACTIONS.TASK_UNASSIGN,
    {|
      taskId: string,
      taskStoreAddress: string,
      worker: string,
      colonyENSName: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_UNASSIGN_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_UNASSIGN_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_UNASSIGN_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_UNASSIGN_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_INVITE: UniqueActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE,
    {|
      taskId: string,
      taskStoreAddress: string,
      worker: string,
      colonyENSName: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_INVITE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_INVITE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_REQUEST: UniqueActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST,
    {|
      taskId: string,
      taskStoreAddress: string,
      colonyENSName: string,
      worker: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_REQUEST_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SEND_WORK_REQUEST_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_SUBMIT_DELIVERABLE: UniqueActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE,
    {|
      colonyENSName: string,
      taskId: number,
      deliverableHash: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SUBMIT_DELIVERABLE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SUBMIT_DELIVERABLE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SUBMIT_DELIVERABLE_SUCCESS,
    *, // TODO define type
    WithKeyPathDepth2,
  >,
  TASK_UPDATE: UniqueActionType<
    typeof ACTIONS.TASK_UPDATE,
    *,
    WithKeyPathDepth2,
  >,
  TASK_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_UPDATE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_UPDATE_SUCCESS,
    *, // $Shape<TaskType>,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_CLAIM_REWARD: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD,
    {|
      taskId: number,
      colonyENSName: string,
      tokenAddresses: string[],
    |},
    WithKeyPathDepth2,
  >,
  TASK_WORKER_CLAIM_REWARD_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_CLAIM_REWARD_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD_SUCCESS,
    {
      eventData: $PropertyType<
        $PropertyType<ColonyClientType, 'events'>,
        'TaskPayoutClaimed',
      >,
    },
    WithKeyPathDepth2,
  >,
  TASK_WORKER_END: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_END,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
      workDescription: *,
      rating: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_WORKER_END_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_WORKER_END_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_END_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_END_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_RATE_MANAGER: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
      rating: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_WORKER_RATE_MANAGER_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_RATE_MANAGER_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_RATE_MANAGER_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
    |},
    WithKeyPathDepth2,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_REVEAL_MANAGER_RATING_SUCCESS,
    {
      eventData: $PropertyType<
        $PropertyType<ColonyClientType, 'events'>,
        'TaskWorkRatingRevealed',
      >,
    },
    WithKeyPathDepth2,
  >,
|};
