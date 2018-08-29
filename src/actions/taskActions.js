// @flow

import { ADD_COMMENT_TO_TASK } from './actionConstants';

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
Changes simple properties: Name, Title, Bounty, Tag
Call with { property, value }

Task Spec goes onchain, DDB does not handle (?)
*/
export function editTask() {}

export function fetchCommentsForTask() {}
export function removeUserFromTask() {}
export function assignTaskToUser() {}
export function setTaskLastSeen() {}
