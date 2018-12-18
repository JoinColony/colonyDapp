/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord } from '~immutable';
import type { DataRecordMap } from '~utils/reducers';

import { Colony } from '~immutable';

import ns from '../namespace';

type RootState = {
  [typeof ns]: {
    allColonies: {
      colonies: DataRecordMap<ENSName, ColonyRecord>,
      avatars: ImmutableMap<string, string>,
    },
  },
};

type ColonyAvatarSelector = (state: RootState, props: Object) => string;

export const allColoniesSelector = (state: RootState) => state[ns].allColonies;

export const coloniesSelector = (state: RootState) =>
  allColoniesSelector(state).colonies;

export const colonyAvatarsSelector = (state: RootState) =>
  allColoniesSelector(state).avatars;

export const singleColonySelector = (
  state: RootState,
  ensName: ENSName,
): ColonyRecord => coloniesSelector(state).get(ensName, Colony());

export const currentColonyAvatarHashSelector: ColonyAvatarSelector = createSelector(
  coloniesSelector,
  (state, props) => props.ensName,
  (colonies, ensName) => colonies.get(ensName, Colony()).avatar,
);

export const currentColonyAvatarDataSelector: ColonyAvatarSelector = createSelector(
  currentColonyAvatarHashSelector,
  colonyAvatarsSelector,
  (hash, avatars) => avatars.get(hash),
);
