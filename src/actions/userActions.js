// @flow

import {
  SET_PROFILE_STATE,
  STATE_READY,
  EDIT_PROFILE,
  LOAD_PROFILE,
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

// Sagas use this action to update Redux
export function setUserProfileContent({ property, value }): Action {
  return {
    type: UPDATE_PROFILE,
    payload: { update: { property, value } },
  };
}

/*
   Dapp uses the following actions to call Sagas to edit profile and update Redux
*/
export function editWholeProfile(profile: {}): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'profile', value: profile } },
  };
}

export function fetchWholeProfile(key: string): Action {
  return {
    type: LOAD_PROFILE,
    payload: { key },
  };
}

export function addColonyToUserProfile(colonyId: string): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'colonies', value: colonyId } },
  };
}

export function addTaskToUserProfile(task: {}): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'tasks', value: task } },
  };
}

export function setUserAvatar(avatarHash: string): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'avatar', value: avatarHash } },
  };
}

export function setUserBio(bio: string): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'bio', value: bio } },
  };
}

export function setUserName(name: string): Action {
  return {
    type: EDIT_PROFILE,
    payload: { update: { property: 'name', value: name } },
  };
}

// updates user's notifications database
export function notifyUser() {}

// user updates own events aka recent actions
export function updateUserEvents() {}
