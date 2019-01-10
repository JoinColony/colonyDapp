/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootState } from '~types';

import ns from '../namespace';

/*
 * Drafts selectors
 */
export const allDraftsSelector = (state: RootState) => state[ns].allDrafts;

export const colonyDraftsSelector = createSelector(
  allDraftsSelector,
  (state, props) => props.colonyENSName,
  (allDrafts, colonyENSName) =>
    allDrafts.get(colonyENSName, new ImmutableMap()),
);

export const singleDraftSelector = createSelector(
  colonyDraftsSelector,
  (state, props) => props.draftId,
  (drafts, draftId) => drafts.get(draftId),
);

export const draftStoreAddressSelector = createSelector(
  singleDraftSelector,
  draft => (draft ? draft.getIn(['record', 'databases', 'draftStore']) : null),
);
