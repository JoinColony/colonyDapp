/* @flow */

import { createSelector } from 'reselect';

import type { RootState, ENSName } from '~types';
import type { DraftRecord, DataRecord, DraftId } from '~immutable';

import type { AllDraftsState, DraftsMap } from '../types';

import ns from '../namespace';

/*
 * Drafts selector types
 */
type AllDraftsSelector = (state: RootState) => AllDraftsState;
type ColonyDraftsSelector = (
  state: RootState,
  props: { colonyENSName: ENSName },
) => DraftsMap;
type SingleDraftSelector = (
  state: RootState,
  props: { colonyENSName: ENSName, DraftId: DraftId },
) => ?DataRecord<DraftRecord>;
type DraftStoreAddressSelector = (
  state: RootState,
  props: { colonyENSName: ENSName, draftId: DraftId },
) => ?string;

/*
 * Drafts selectors
 */
export const allDraftsSelector: AllDraftsSelector = createSelector(
  (state: RootState) => state[ns].allDrafts,
);
export const colonyDraftsSelector: ColonyDraftsSelector = createSelector(
  allDraftsSelector,
  (state, props) => props.colonyENSName,
  (allDrafts, colonyENSName) => allDrafts.get(colonyENSName),
);
export const singleDraftSelector: SingleDraftSelector = createSelector(
  colonyDraftsSelector,
  (state, props) => props.draftId,
  (drafts, draftId) => drafts.get(draftId),
);
export const draftStoreAddressSelector: DraftStoreAddressSelector = createSelector(
  singleDraftSelector,
  draft => (draft ? draft.getIn(['record', 'databases', 'draftStore']) : null),
);
