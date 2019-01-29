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

import type { UniqueActionWithKeyPath } from '~types';
import type { AllDraftsMap, DraftRecord } from '~immutable';

const allDraftsReducer = (
  state: AllDraftsMap = ImmutableMap(),
  action: UniqueActionWithKeyPath,
) => {
  switch (action.type) {
    case DRAFT_CREATE_SUCCESS:
    case DRAFT_UPDATE_SUCCESS:
    case DRAFT_FETCH_SUCCESS: {
      const {
        meta: {
          keyPath: [ensName, domainId],
          keyPath,
        },
        payload,
      } = action;
      const data = Data<DraftRecord>({
        record: Draft({ domainId, ...payload }),
      });

      return state.get(ensName)
        ? state.mergeDeepIn(keyPath, data)
        : state.set(ensName, ImmutableMap([[domainId, data]]));
    }

    case DRAFT_REMOVE_SUCCESS: {
      const { keyPath } = action.meta;
      return state.deleteIn(keyPath);
    }
    default:
      return state;
  }
};

export default withDataReducer<AllDraftsMap, DraftRecord>(
  DRAFT_FETCH,
  ImmutableMap(),
)(allDraftsReducer);
