/* @flow */

import update from 'react-addons-update';

import { UPDATE_PROFILE } from '../actions';

import { INITIAL_STATE } from '../types';
import type { Action, DataReduxStore } from '../types';

export function dataReducer(
  state: DataReduxStore = INITIAL_STATE,
  action: Action,
) {
  switch (action.type) {
    case UPDATE_PROFILE: {
      const {
        update: { profileKey, property: profileProperty, value: profileValue },
      } = action.payload;

      return profileProperty === 'profile'
        ? update(state, {
            data: { profiles: { [profileKey]: { $set: profileValue } } },
          })
        : update(state, {
            data: {
              profiles: {
                [profileKey]: {
                  [profileProperty]: {
                    $apply: prop => {
                      if (Array.isArray(prop)) {
                        return prop.concat(profileValue);
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
