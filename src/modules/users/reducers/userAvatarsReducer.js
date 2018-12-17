/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { withDataReducer } from '~utils/reducers';
import { User } from '~immutable';

import {
  USER_AVATAR_FETCH,
  USER_AVATAR_FETCH_ERROR,
  USER_AVATAR_FETCH_SUCCESS,
} from '../actionTypes';

// eslint-disable-next-line no-unused-vars
const userAvatarsReducer = (state = new ImmutableMap(), action) => state;

export default withDataReducer(
  {
    fetch: USER_AVATAR_FETCH,
    error: USER_AVATAR_FETCH_ERROR,
    success: USER_AVATAR_FETCH_SUCCESS,
  },
  User,
)(userAvatarsReducer);
