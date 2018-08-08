/* @flow */

import { reducer as formReducer } from 'redux-form';
import { combineReducers } from 'redux';
import { reducer as dataReducer } from './dataReducer';

const rootReducer = combineReducers({
  form: formReducer,
  data: dataReducer,
});

export default rootReducer;
