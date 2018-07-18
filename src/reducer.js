/* @flow */

import { combineReducers } from 'redux';
import { reducer as dataReducer } from './data/reducer';

const rootReducer = combineReducers({
  form: formReducer,
  data: dataReducer,
});

export default rootReducer;
