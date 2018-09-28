// @flow

import {
  JOIN_COLONY,
  SET_PROFILE_STATE,
  SET_PROFILE_CONTENT,
  STATE_READY,
  UPDATE_PROFILE,
} from './constants';

import type { Action } from './actionConstants';

export function userProfileReady(data: ?{}): Action {
  return {
    type: SET_PROFILE_STATE,
    state: STATE_READY,
    data,
  };
}

export function setUserProfileContent({ property, value }): Action {
  return {
    type: UPDATE_PROFILE,
    payload: { update: { property, value } },
  };
}

export function updateUserProfile({ type, update }) {
  return { type: UPDATE_PROFILE, payload: update };
}

export function addColonyToUserProfile(colonyId: string): Action {
  return {
    type: JOIN_COLONY,
    payload: { colonyId },
  };
}

export function addOrChangeUserAvatar() {}

// updates user's notifications database
export function notifyUser() {}

// user updates own events aka recent actions
export function updateUserEvents() {}
