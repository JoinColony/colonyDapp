/* @flow */

import update from 'react-addons-update';

import {
  STORE_DATA_CLASS,
  INITIAL_STATE,
  LOAD_COLONY,
  LOAD_DOMAIN,
  SET_COLONY_CONTENT,
  SET_DOMAIN_CONTENT,
  SET_DATA_STATE,
  SET_PROFILE_CONTENT,
  SET_PROFILE_STATE,
  UPDATE_COLONY,
  UPDATE_DOMAIN,
  UPDATE_TASK,
} from '../actions/actionConstants';

import type { Action } from '../actions/actionConstants';

export function reducer(state: DataReduxStore = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case STORE_DATA_CLASS:
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

    case LOAD_DOMAIN:
      const { domainId, content } = action.payload;
      return update(state, {
        data: { domains: { [domainId]: { $set: content } } },
      });

    case LOAD_COLONY:
      state.data.colonies[action.payload.target] = action.payload.content;

      return state;

    case UPDATE_COLONY:
      const {
        colonyId,
        update: { property: colonyProperty, value: colonyValue },
      } = action.payload;
      return update(state, {
        data: {
          colonies: {
            [colonyId]: {
              [colonyProperty]: {
                $set: colonyValue,
              },
            },
          },
        },
      });

    case UPDATE_DOMAIN:
      const {
        domainId: domaneId,
        update: { property: domainProperty, value: domainValue },
      } = action.payload;
      return update(state, {
        data: {
          domains: {
            [domaneId]: {
              [domainProperty]: {
                $set: domainValue,
              },
            },
          },
        },
      });

    case UPDATE_TASK:
      const {
        domainId: domain,
        taskId: taskID,
        update: { property: taskProperty, value: taskValue },
      } = action.payload;
      if (!taskValue) return state;
      return update(state, {
        data: {
          domains: {
            [domain]: {
              tasks: {
                $apply: ts =>
                  ts.map(t => {
                    if (t._id === taskID) {
                      if (Array.isArray(t[taskProperty])) {
                        t[taskProperty].push(taskValue);
                      } else {
                        t[taskProperty] = taskValue;
                      }
                    }
                    return t;
                  }),
              },
            },
          },
        },
      });

    case SET_COLONY_CONTENT:
      const {
        colonyId: colony,
        update: { property: colonyProp, value: colonyVal },
      } = action.payload;

      return update(state, {
        data: {
          colonies: {
            [colony]: {
              [colonyProp]: {
                $apply: prop => {
                  if (Array.isArray(prop)) {
                    prop.push(colonyVal);
                  } else {
                    prop = colonyValue;
                  }
                },
              },
            },
          },
        },
      });

    case SET_DOMAIN_CONTENT:
      const {
        domainId: domainID,
        update: { property: domainProp, value: domainVal },
      } = action.payload;

      return update(state, {
        data: {
          domains: {
            [domainID]: {
              [domainProp]: {
                $apply: prop => {
                  if (Array.isArray(prop)) {
                    prop.push(domainVal);
                  } else {
                    prop = domainValue;
                  }
                },
              },
            },
          },
        },
      });

    case SET_PROFILE_CONTENT:
      const {
        update: { property: profileProperty, value: profileValue },
      } = action.payload;

      return update(state, {
        data: {
          my_profile: {
            [profileProperty]: {
              $apply: prop => {
                if (Array.isArray(prop)) {
                  prop.push(profileValue);
                } else {
                  prop = profileValue;
                }
              },
            },
          },
        },
      });

    default:
      return state;
  }
}
