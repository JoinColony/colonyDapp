/* @flow */

import {
  INITIALIZE_DATA,
  INITIAL_STATE,
  JOIN_COLONY,
  SET_COLONY_CONTENT,
  SET_DOMAIN_CONTENT,
  SET_DATA_STATE,
  SET_PROFILE_CONTENT,
  SET_PROFILE_STATE,
  SET_TASK_CONTENT,
} from '../actions/actionConstants';

import type { Action } from '../actions/actionConstants';

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

    // todo generalize this
    case SET_TASK_CONTENT:
      const domainId = action.payload.target[0];
      const taskId = action.payload.target[1];

      const domane = state.data.domains[domainId];
      let task = domane.tasks.filter(t => t._id === taskId)[0];

      task = mergeContent(task, {
        target: 'comments',
        content: action.payload.content,
      });

      return {
        ...state,
        data: { ...state.data, domane },
      };

    case SET_COLONY_CONTENT:
      const colonies = mergeContent(state.data.colonies, action.payload);
      return {
        ...state,
        data: { ...state.data, colonies },
      };

    case SET_DOMAIN_CONTENT:
      const domains = mergeContent(state.data.domains, action.payload);
      return {
        ...state,
        data: { ...state.data, domains },
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
