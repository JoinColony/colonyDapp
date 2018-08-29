// @flow

import {
  JOIN_COLONY,
  SET_PROFILE_STATE,
  SET_PROFILE_CONTENT,
  STATE_READY,
} from './actionConstants';

import type { Action } from './actionConstants';

export function userProfileReady(data: ?{}): Action {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

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

export function addOrChangeUserAvatar() {}

/*
Changes simple properties: name, bio, email
Call with { property, value }
*/
export function editUserProfile() {}

// updates user's notifications database
export function notifyUser() {}

// user updates own events aka recent actions
export function updateUserEvents() {}
