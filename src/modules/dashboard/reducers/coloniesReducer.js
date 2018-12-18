/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  COLONY_AVATAR_REMOVE_SUCCESS,
  COLONY_AVATAR_UPLOAD_SUCCESS,
  COLONY_FETCH,
  COLONY_FETCH_ERROR,
  COLONY_FETCH_SUCCESS,
  COLONY_PROFILE_UPDATE_SUCCESS,
} from '../actionTypes';

import { Colony, Token } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { ColonyRecord } from '~immutable';
import type { Action, ENSName } from '~types';

const coloniesReducer = (
  state: ImmutableMap<ENSName, ColonyRecord> = new ImmutableMap(),
  action: Action,
) => {
  switch (action.type) {
    case COLONY_PROFILE_UPDATE_SUCCESS: {
      const { ensName, colonyUpdateValues } = action.payload;
      return state.mergeIn([ensName], colonyUpdateValues);
    }
    case COLONY_AVATAR_UPLOAD_SUCCESS: {
      const { hash, ensName } = action.payload;
      return state.setIn([ensName, 'avatar'], hash);
    }
    case COLONY_AVATAR_REMOVE_SUCCESS: {
      const { ensName } = action.payload;
      return state.setIn([ensName, 'avatar'], undefined);
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, ColonyRecord>(
  {
    error: COLONY_FETCH_ERROR,
    fetch: COLONY_FETCH,
    success: new Map([
      [
        COLONY_FETCH_SUCCESS,
        (
          state,
          {
            payload: {
              props: { token, ensName, ...props },
            },
          },
        ) =>
          state.set(
            ensName,
            Colony({
              ensName,
              token: Token(token),
              ...props,
            }),
          ),
      ],
    ]),
  },
  Colony,
)(coloniesReducer);
