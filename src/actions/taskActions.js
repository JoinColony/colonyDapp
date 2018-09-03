// @flow

import {
  ADD_COMMENT_TO_TASK,
  FETCH_COMMENTS,
  EDIT_TASK,
} from './actionConstants';

import type { Action } from './actionConstants';

export function addCommentToTask(
  domainId: string,
  taskId: string,
  comment: string,
): Action {
  return {
    type: ADD_COMMENT_TO_TASK,
    payload: { domainId, taskId, comment },
  };
}

/*
Changes simple properties: Name, Title, Bounty
Call with { property, value }

Task Spec goes onchain, DDB does not handle (?)
*/
export function editTask(domainId, taskId, update): Action {
  return {
    type: EDIT_TASK,
    payload: { domainId, taskId, update },
  };
}

export function fetchCommentsForTask(domainId, taskId): Action {
  return {
    type: FETCH_COMMENTS,
    payload: { domainId, taskId },
  };
}
export function removeUserFromTask() {}
export function assignTaskToUser() {}
export function setTaskLastSeen() {}
