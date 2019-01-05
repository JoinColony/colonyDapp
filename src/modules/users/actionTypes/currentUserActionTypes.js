/* @flow */

import ns from '../namespace';

/*
 * Current User Action Types
 */

export const USERNAME_VALIDATE = `${ns}/USERNAME_VALIDATE`;
export const USERNAME_VALIDATE_SUCCESS = `${ns}/USERNAME_VALIDATE_SUCCESS`;
export const USERNAME_VALIDATE_ERROR = `${ns}/USERNAME_VALIDATE_ERROR`;

export const USERNAME_CREATE = `${ns}/USERNAME_CREATE`;
export const USERNAME_CREATE_ERROR = `${ns}/USERNAME_CREATE_ERROR`;
export const USERNAME_CREATE_SUCCESS = `${ns}/USERNAME_CREATE_SUCCESS`;

export const CURRENT_USER_CREATE = `${ns}/CURRENT_USER_CREATE`;
export const CURRENT_USER_CREATE_ERROR = `${ns}/CURRENT_USER_CREATE_ERROR`;
export const CURRENT_USER_CREATE_SUCCESS = `${ns}/CURRENT_USER_CREATE_SUCCESS`;

export const USER_ACTIVITIES_UPDATE = `${ns}/USER_ACTIVITIES_UPDATE`;
export const USER_ACTIVITIES_UPDATE_ERROR = `${ns}/USER_ACTIVITIES_UPDATE_ERROR`;
export const USER_ACTIVITIES_UPDATE_SUCCESS = `${ns}/USER_ACTIVITIES_UPDATE_SUCCESS`;

export const USER_PROFILE_UPDATE = `${ns}/USER_PROFILE_UPDATE`;
export const USER_PROFILE_UPDATE_ERROR = `${ns}/USER_PROFILE_UPDATE_ERROR`;
export const USER_PROFILE_UPDATE_SUCCESS = `${ns}/USER_PROFILE_UPDATE_SUCCESS`;

export const USER_UPLOAD_AVATAR = `${ns}/USER_UPLOAD_AVATAR`;
export const USER_UPLOAD_AVATAR_ERROR = `${ns}/USER_UPLOAD_AVATAR_ERRROR`;
export const USER_UPLOAD_AVATAR_SUCCESS = `${ns}/USER_UPLOAD_AVATAR_SUCCESS`;

export const USER_REMOVE_AVATAR = `${ns}/USER_REMOVE_AVATAR`;
export const USER_REMOVE_AVATAR_ERROR = `${ns}/USER_REMOVE_AVATAR_ERRROR`;
export const USER_REMOVE_AVATAR_SUCCESS = `${ns}/USER_REMOVE_AVATAR_SUCCESS`;

export const USER_FETCH_TOKEN_TRANSFERS = `${ns}/USER_FETCH_TOKEN_TRANSFERS`;
export const USER_FETCH_TOKEN_TRANSFERS_ERROR = `${ns}/USER_FETCH_TOKEN_TRANSFERS_ERROR`;
export const USER_FETCH_TOKEN_TRANSFERS_SUCCESS = `${ns}/USER_FETCH_TOKEN_TRANSFERS_SUCCESS`;
