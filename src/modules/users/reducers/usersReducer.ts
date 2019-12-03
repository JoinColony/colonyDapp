import { combineReducers } from 'redux-immutable';

import userColoniesReducer from './userColoniesReducer';

import { USERS_COLONIES } from '../constants';

export default combineReducers({
  [USERS_COLONIES]: userColoniesReducer,
});
