/* @flow */

import update from 'immutability-helper';

import {
  INITIAL_STATE,
  UPDATE_ENTIRE_PROFILE,
  UPDATE_PROFILE,
} from '../actionTypes';

import type { Action } from '../types';

export default function dataReducer(state: {} = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case UPDATE_ENTIRE_PROFILE: {
      const { profileKey, value: profileValue } = action.payload;

      return update(state, {
        data: { profiles: { [profileKey]: { $set: profileValue } } },
      });
    }

    case UPDATE_PROFILE: {
      const {
        profileKey,
        property: profileProperty,
        value: profileValue,
      } = action.payload;

      return update(state, {
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
