/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootState } from '~types';

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
