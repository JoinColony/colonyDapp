/* @flow */

import {
  INITIALIZE_DATA,
  INITIAL_STATE,
  SET_DATA_STATE,
  SET_PROFILE_CONTENT,
  SET_PROFILE_STATE,
} from '../actions/actionConstants';

export function reducer(state: DataReduxStore = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case INITIALIZE_DATA:
      return { ...state, Data: action.Data };
    case SET_DATA_STATE:
      return { ...state, state: action.state, data: action.data };
    case SET_PROFILE_STATE:
      return {
        ...state,
        my_profile: {
          ...state.my_profile,
          state: action.state,
          data: action.data,
        },
      };
    case SET_PROFILE_CONTENT:
      return {
        ...state,
        my_profile: { ...state.my_profile, content: action.content },
      };
    default:
      return state;
  }
}
