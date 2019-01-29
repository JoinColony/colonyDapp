/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { RootStateRecord } from '~immutable';

import { singleDraftSelector } from './drafts';

import {
  DASHBOARD_ALL_COMMENTS,
  DASHBOARD_NAMESPACE as ns,
} from '../constants';

/*
 * Drafts selectors
 */
export const allCommentsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_COMMENTS], new ImmutableMap());

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
