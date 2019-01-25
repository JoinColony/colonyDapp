/* @flow */

import { createSelector } from 'reselect';

import { Map as ImmutableMap } from 'immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_DRAFTS } from '../constants';
import type { RootStateRecord } from '~immutable';

export const allDraftsSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_DRAFTS], ImmutableMap());

export const colonyDraftsSelector = createSelector(
  allDraftsSelector,
  (state, props) => props.colonyENSName,
  (allDrafts, colonyENSName) => allDrafts.get(colonyENSName, ImmutableMap()),
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
