/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootState } from '~types';

import { singleDraftSelector } from './drafts';

import ns from '../namespace';

/*
 * Drafts selectors
 */
export const allCommentsSelector = (state: RootState) => state[ns].allComments;

export const draftsCommentsSelector = createSelector(
  allCommentsSelector,
  (state, props) => props.draftId,
  (allComments, draftId) => allComments.get(draftId, new ImmutableMap()),
);

export const commentsStoreAddressSelector = createSelector(
  singleDraftSelector,
  draft =>
    draft ? draft.getIn(['record', 'databases', 'commentsStore']) : null,
);
