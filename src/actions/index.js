// @flow

import {
  ADD_COMMENT_TO_TASK,
  ADD_DOMAIN_TO_COLONY,
  ADD_TASK_TO_DOMAIN,
  INITIALIZE_DATA,
  JOIN_COLONY,
  SET_DATA_STATE,
  STATE_LOADING,
  SET_PROFILE_STATE,
  SET_PROFILE_CONTENT,
  STATE_READY,
} from './actionConstants';

import type { Action } from './actionConstants';

/* Setup */

export function loadState(): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_LOADING,
    data: null,
  };
}

export function dataReady(data: ?{}): Action {
  return {
    type: SET_DATA_STATE,
    state: STATE_READY,
    data,
  };
}

export function userProfileReady(data: ?{}): Action {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

export function initialData(Data: {}): Action {
  return {
    type: INITIALIZE_DATA,
    Data,
  };
}

/* User Actions */
export function setUserProfileContent(content: ?{}): Action {
  return {
    type: SET_PROFILE_CONTENT,
    payload: { content },
  };
}

export function addColonyToUserProfile(colonyId: string): Action {
  return {
    type: JOIN_COLONY,
    payload: { colonyId },
  };
}

export function addOrChangeEmail() {}
export function addOrChangeUserAvatar() {}

// updates user's notifications database
export function notifyUser() {}

// user updates own events aka recent actions
export function updateUserEvents() {}

/* Colony Actions */

// create domain database, add hash to colony domains list
export function addDomainToColony(colonyId: string, domainId: string): Action {
  return {
    type: ADD_DOMAIN_TO_COLONY,
    payload: { colonyId, domainId },
  };
}

// grant permissions to user via smart contract
export function setUserAsAdmin() {}

// grant permissions to user via smart contract
export function setUserAsMember() {}

// creates colony database with given info, puts in redux
export function createColony() {}

// loads colony database into redux
export function loadColony() {}

export function editColony() {}

export function storeColonyAvatarOnIPFS() {}
export function removeColonyAvatar() {}

/* Domain, Task, and Comment Actions */
export function loadDomain() {}

// grant permissions to user via smart contract
export function addUserToDomain() {}

export function addTaskToDomain(domainId: string, task: any): Action {
  return {
    type: ADD_TASK_TO_DOMAIN,
    payload: { domainId, task },
  };
}

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

export function addTagToTask() {}
export function removeTagFromTask() {}

export function fetchCommentsForTask() {}
export function uploadFileToIPFS() {}

export function createWorkInvite() {}
export function createWorkRequest() {}

export function removeUserFromTask() {}
export function assignTaskToUser() {}

export function setTaskLastSeen() {}

export function fetchTaskDescription() {}

export function updateTaskTitle() {}

export function updateTaskDescription() {}
