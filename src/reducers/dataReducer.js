/* @flow */

import {
  INITIALIZE_DATA,
  INITIAL_STATE,
  JOIN_COLONY,
  SET_DATA_STATE,
  SET_PROFILE_CONTENT,
  SET_PROFILE_STATE,
} from '../actions/actionConstants';

const mergeContent = (data, { target: key, content }) => {
  if (key && !data[key]) {
    data[key] = content;
  } else if (key && data[key] && Array.isArray(data[key])) {
    data[key] = data[key].concat(content);
  } else {
    data = { ...data, ...content };
  }
  return data;
};

// action.content: { 'property': 'value' }
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
      let { data } = state.my_profile;
      data = mergeContent(data, action.payload);

      return {
        ...state,
        my_profile: { ...state.my_profile, data },
      };
    default:
      return state;
  }
}
