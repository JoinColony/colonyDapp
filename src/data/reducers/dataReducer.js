/* @flow */

import update from 'immutability-helper';

import { INITIAL_STATE, UPDATE_PROFILE } from '../actionTypes';

import type { Action } from '../types';

export function dataReducer(state: {} = INITIAL_STATE, action: Action) {
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
                    $apply: prop =>
                      Array.isArray(prop)
                        ? prop.concat(profileValue)
                        : profileValue,
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
