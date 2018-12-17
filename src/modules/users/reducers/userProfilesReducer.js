/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { User } from '~immutable';

import {
  USER_PROFILE_FETCH,
  USER_PROFILE_FETCH_ERROR,
  USER_PROFILE_FETCH_SUCCESS,
} from '../actionTypes';

// eslint-disable-next-line no-unused-vars
const userProfilesReducer = (state = new ImmutableMap(), action) => state;

export default withDataReducer(
  {
    fetch: USER_PROFILE_FETCH,
    error: USER_PROFILE_FETCH_ERROR,
    success: USER_PROFILE_FETCH_SUCCESS,
  },
  User,
)(userProfilesReducer);
