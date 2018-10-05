// @flow

import {
  EDIT_PROFILE,
  GET_PROFILE_PROPERTY,
  LOAD_PROFILE,
  UPDATE_ENTIRE_PROFILE,
  UPDATE_PROFILE,
} from '../actionTypes';

import type { Action } from '../types';

// Sagas use this action to update Redux
export function setUserProfileContent({
  profileKey = 'my-profile',
  property,
  value,
}: {
  profileKey: string,
  property: string,
  value: any,
}): Action {
  return {
    type: UPDATE_PROFILE,
    payload: { profileKey, property, value },
  };
}

export function setEntireUserProfile({
  profileKey = 'my-profile',
  value,
}: {
  profileKey: string,
  value: any,
}): Action {
  return {
    type: UPDATE_ENTIRE_PROFILE,
    payload: { profileKey, value },
  };
}

/*
   Dapp uses the following actions to call Sagas to edit profile and update Redux
*/
export function editWholeProfile(
  profile: {},
  profileKey: string = 'my-profile',
): Action {
  return {
    type: SET_PROFILE,
    payload: { profileKey, value: profile },
  };
}

export function fetchWholeProfile(profileKey: string = 'my-profile'): Action {
  return {
    type: LOAD_PROFILE,
    payload: { profileKey },
  };
}

export function fetchProfileProperty(
  profileKey: string = 'my-profile',
  property: string,
): Action {
  return {
    type: GET_PROFILE_PROPERTY,
    payload: { profileKey, property },
  };
}

export function addColonyToUserProfile(
  profileKey: string = 'my-profile',
  colonyId: string,
): Action {
  return {
    type: EDIT_PROFILE,
    payload: { profileKey, property: 'colonies', value: colonyId },
  };
}

export function addTaskToUserProfile(
  profileKey: string = 'my-profile',
  task: {},
): Action {
  return {
    type: EDIT_PROFILE,
    payload: { profileKey, property: 'tasks', value: task },
  };
}

export function setUserAvatar(
  profileKey: string = 'my-profile',
  avatarHash: string,
): Action {
  return {
    type: EDIT_PROFILE,
    payload: { profileKey, property: 'avatar', value: avatarHash },
  };
}

export function setUserBio(
  profileKey: string = 'my-profile',
  bio: string,
): Action {
  return {
    type: EDIT_PROFILE,
    payload: { profileKey, property: 'bio', value: bio },
  };
}

export function setUserName(
  profileKey: string = 'my-profile',
  name: string,
): Action {
  return {
    type: EDIT_PROFILE,
    payload: { profileKey, property: 'name', value: name },
  };
}

// updates user's notifications database
export function notifyUser() {}

// user updates own events aka recent actions
export function updateUserEvents() {}
