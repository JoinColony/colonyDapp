/* @flow */

import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  form: formReducer,
});

export default rootReducer;
