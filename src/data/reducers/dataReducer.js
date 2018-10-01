/* @flow */

import update from 'react-addons-update';

import {
  STORE_DATA_CLASS,
  SET_DATA_STATE,
  UPDATE_PROFILE,
  SET_PROFILE_STATE,
} from '../actions';

import { INITIAL_STATE } from '../types';
import type { Action, DataReduxStore } from '../types';

export function dataReducer(
  state: DataReduxStore = INITIAL_STATE,
  action: Action,
) {
  switch (action.type) {
    case STORE_DATA_CLASS:
      return { ...state, Data: action.payload.Data };

    case UPDATE_PROFILE: {
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
                      }
                      return profileValue;
                    },
                  },
                },
              },
            },
          });
    }

    default:
      return state;
  }
}
