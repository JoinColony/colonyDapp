/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootState } from '~types';

import { singleDraftSelector } from './drafts';

import ns from '../namespace';

/*
 * Drafts selectors
 */
export const allFeedsSelector = (state: RootState) => state[ns].allFeeds;

export const draftsFeedsSelector = createSelector(
  allFeedsSelector,
  (state, props) => props.draftId,
  (allFeeds, draftId) => allFeeds.get(draftId, new ImmutableMap()),
);

export const feedsStoreAddressSelector = createSelector(
  singleDraftSelector,
  draft => (draft ? draft.getIn(['record', 'databases', 'feedsStore']) : null),
);
