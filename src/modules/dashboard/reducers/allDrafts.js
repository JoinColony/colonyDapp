/* @flow */

import { Map as ImmutableMap } from 'immutable';

import {
  DRAFT_CREATE_SUCCESS,
  DRAFT_FETCH,
  DRAFT_FETCH_SUCCESS,
  DRAFT_REMOVE_SUCCESS,
  DRAFT_UPDATE_SUCCESS,
} from '../actionTypes';

import { Draft, Data } from '~immutable';
import { withDataReducer } from '~utils/reducers';

import type { ENSName } from '~types';

import type { AllDraftsState, DraftsMap } from '../types';

const allDraftsReducer = (
  state: AllDraftsState = new ImmutableMap(),
  action: { type: string, payload: { keyPath: [*, *], props: {} } },
) => {
  switch (action.type) {
    case DRAFT_CREATE_SUCCESS:
    case DRAFT_UPDATE_SUCCESS:
    case DRAFT_FETCH_SUCCESS: {
      const {
        keyPath: [ensName, domainId],
        keyPath,
        props,
      } = action.payload;
      const data = Data({ record: Draft({ domainId, ...props }) });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap([[domainId, data]]));
    }

    case DRAFT_REMOVE_SUCCESS: {
      const { keyPath } = action.payload;
      return state.deleteIn(keyPath);
    }
    default:
      return state;
  }
};

export default withDataReducer<ENSName, DraftsMap>(DRAFT_FETCH)(
  allDraftsReducer,
);
