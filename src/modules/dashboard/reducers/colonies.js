/* @flow */

import { Map as ImmutableMap } from 'immutable';

import { COLONY_FETCH_SUCCESS } from '../actionTypes';

import { Colony, ColonyMeta, Token } from '~immutable';

import type { Action, ColonyRecord, ENSName } from '~types';

type State = ImmutableMap<ENSName, ColonyRecord>;

const INITIAL_STATE: State = new ImmutableMap();

const coloniesReducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case COLONY_FETCH_SUCCESS: {
      const {
        colonyStoreData: {
          meta: { ensName, ...meta },
          token,
          ...colonyStoreData
        },
      } = action.payload;
      return state.set(
        ensName,
        Colony({
          meta: ColonyMeta({ ensName, ...meta }),
          token: Token(token),
          ...colonyStoreData,
        }),
      );
    }
    default:
      return state;
  }
};

export default coloniesReducer;
