/* @flow */

import update from 'react-addons-update';

import {
  STORE_DATA_CLASS,
  INITIAL_STATE,
  LOAD_COLONY,
  LOAD_DOMAIN,
  SET_DOMAIN_CONTENT,
  SET_DATA_STATE,
  UPDATE_PROFILE,
  SET_PROFILE_STATE,
  UPDATE_COLONY,
  UPDATE_DOMAIN,
  UPDATE_TASK,
} from '../../actions';

import type { Action } from '../../actions';

export function dataReducer(
  state: DataReduxStore = INITIAL_STATE,
  action: Action,
) {
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
      const { colonyId: loadColonyId, colony: loadColony } = action.payload;
      return update(state, {
        data: {
          colonies: {
            [loadColonyId]: {
              $set: loadColony,
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

    case UPDATE_COLONY:
      const {
        colonyId: colony,
        update: { property: colonyProp, value: colonyVal },
      } = action.payload;

      const myUpdate = update(state, {
        data: {
          colonies: {
            [colony]: {
              [colonyProp]: {
                $apply: prop => {
                  if (Array.isArray(prop)) {
                    prop.push(colonyVal);
                    return prop;
                  } else {
                    return colonyValue;
                  }
                },
              },
            },
          },
        },
      });
      console.log(myUpdate);
      return myUpdate;

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

    case UPDATE_PROFILE:
      const {
        update: { profileKey, property: profileProperty, value: profileValue },
      } = action.payload;

      return profileProperty === 'profile'
        ? update(state, { profiles: { [profileKey]: { $set: profileValue } } })
        : update(state, {
            profiles: {
              [profileKey]: {
                data: {
                  [profileProperty]: {
                    $apply: prop => {
                      if (Array.isArray(prop)) {
                        prop.push(profileValue);
                        return prop;
                      } else {
                        return profileValue;
                      }
                    },
                  },
                },
              },
            },
          });

    default:
      return state;
  }
}
