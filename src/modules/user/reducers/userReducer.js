/* @flow */

import update from 'immutability-helper';

import {
  SET_USER_PROFILE,
  SET_CURRENT_USER,
  UPDATE_USER_PROFILE,
} from '../actionTypes';

import type { Action } from '~types/';
import type { UserType } from '~types/user';

type State = {
  currentUser: {
    walletAddress: string,
    profile: UserType,
  } | null,
  profiles: { [walletAddress: string]: UserType },
};

const INITIAL_STATE = { currentUser: null, profiles: {} };

export default function userReducer(
  state: State = INITIAL_STATE,
  action: Action,
) {
  switch (action.type) {
    case SET_CURRENT_USER: {
      const { walletAddress, set } = action.payload;
      return update(state, {
        currentUser: { $set: { walletAddress, profile: set } },
      });
    }

    case SET_USER_PROFILE: {
      const { walletAddress, set } = action.payload;

      return update(state, { profiles: { [walletAddress]: { $set: set } } });
    }

    case UPDATE_USER_PROFILE: {
      // TODO: THIS IS NOT DONE/CORRECT - Please use the following payload (and implement it like this):
      //  payload: { walletAddress: string, update: { name: string, bio: string /* ... */ }}

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
