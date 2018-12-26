/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord, DataMap, DataRecord } from '~immutable';

import ns from '../namespace';

type RootState = {
  [typeof ns]: {
    allColonies: {
      colonies: DataMap<ENSName, ColonyRecord>,
      avatars: ImmutableMap<string, string>,
    },
  },
};

type ColonyAvatarSelector = (state: RootState, props: Object) => string;
type ColonySelector = (
  state: RootState,
  ensName: ENSName,
) => ?DataRecord<ColonyRecord>;
type ENSNameFromRouter = (state: RootState, props: Object) => ENSName;

export const ensNameFromRouter: ENSNameFromRouter = (state, props) =>
  props.match.params.ensName;

export const allColoniesSelector = (state: RootState) => state[ns].allColonies;

export const coloniesSelector = (state: RootState) =>
  allColoniesSelector(state).colonies;

export const colonyAvatarsSelector = (state: RootState) =>
  allColoniesSelector(state).avatars;

export const routerColonySelector: ColonySelector = createSelector(
  coloniesSelector,
  ensNameFromRouter,
  (colonies, ensName) => colonies.get(ensName),
);

export const singleColonySelector: ColonySelector = (
  state: RootState,
  ensName: ENSName,
) => coloniesSelector(state).get(ensName);

export const currentColonyAvatarHashSelector: ColonyAvatarSelector = createSelector(
  coloniesSelector,
  (state, props) => props.ensName,
  (colonies, ensName) => colonies.getIn([ensName, 'record', 'avatar']),
);

export const currentColonyAvatarDataSelector: ColonyAvatarSelector = createSelector(
  currentColonyAvatarHashSelector,
  colonyAvatarsSelector,
  (hash, avatars) => avatars.get(hash),
);
