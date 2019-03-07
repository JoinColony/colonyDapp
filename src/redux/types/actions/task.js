/* @flow */

import type { ColonyClient as ColonyClientType } from '@colony/colony-js-client';

import type { WithKeyPathDepth2 } from '~types';
import type { TaskType } from '~immutable';

import type { ErrorActionType, UniqueActionType } from '../index';

import { ACTIONS } from '../../index';

export type TaskActionTypes = {|
  TASK_COMMENT_ADD: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD,
    {| commentsStoreAddress: string, taskId: string, commentData: * |},
    void,
  >,
  TASK_COMMENT_ADD_ERROR: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_ERROR,
    void,
  >,
  TASK_COMMENT_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_COMMENT_ADD_SUCCESS,
    {| taskId: string, commentData: *, signature: string |},
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
      amount: number,
      domainId: number,
      dueDate: Date,
      fromPot: number,
      skillId: number,
      specificationHash: string,
      token: string,
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
  TASK_FETCH_ALL: UniqueActionType<
    typeof ACTIONS.TASK_FETCH_ALL,
    void,
    WithKeyPathDepth2,
  >,
  TASK_FETCH_COMMENTS: UniqueActionType<
    typeof ACTIONS.TASK_FETCH_COMMENTS,
    *,
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
    void,
    WithKeyPathDepth2,
  >,
  TASK_FINALIZE: UniqueActionType<
    typeof ACTIONS.TASK_FINALIZE,
    {|
      taskId: number, // TODO should be draftId
      colonyENSName: string,
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
  TASK_REMOVE: UniqueActionType<
    typeof ACTIONS.TASK_REMOVE,
    void,
    WithKeyPathDepth2,
  >,
  TASK_REMOVE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_REMOVE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_REMOVE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_REMOVE_SUCCESS,
    void,
    WithKeyPathDepth2,
  >,
  TASK_SET_DATE: UniqueActionType<
    typeof ACTIONS.TASK_SET_DATE,
    {|
      colonyENSName: string,
      dueDate: Date,
      taskId: number, // TODO should be draftId
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
      taskId: number, // TODO should be draftId
      skillId: number,
    |},
    WithKeyPathDepth2,
  >,
  TASK_SET_SKILL_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_SET_SKILL_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_SET_SKILL_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_SET_SKILL_SUCCESS,
    {
      eventData: $PropertyType<
        $PropertyType<ColonyClientType, 'events'>,
        'TaskSkillSet',
      >,
    },
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
    *,
    WithKeyPathDepth2,
  >,
  TASK_UPDATE: UniqueActionType<
    typeof ACTIONS.TASK_UPDATE,
    void,
    WithKeyPathDepth2,
  >,
  TASK_UPDATE_ERROR: ErrorActionType<
    typeof ACTIONS.TASK_UPDATE_ERROR,
    WithKeyPathDepth2,
  >,
  TASK_UPDATE_SUCCESS: UniqueActionType<
    typeof ACTIONS.TASK_UPDATE_SUCCESS,
    $Shape<TaskType>,
    WithKeyPathDepth2,
  >,
  TASK_WORKER_CLAIM_REWARD: UniqueActionType<
    typeof ACTIONS.TASK_WORKER_CLAIM_REWARD,
    {|
      taskId: number, // TODO should be draftId
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
