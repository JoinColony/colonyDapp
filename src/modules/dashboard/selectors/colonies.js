/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord, ColonyAdminRecord } from '~immutable';

import ns from '../namespace';

type RootState = {
  [typeof ns]: {
    colonies: ImmutableMap<ENSName, ColonyRecord>,
  },
};

type CurrentColonySelector = (state: RootState, props: Object) => ColonyRecord;

type ColonyAdminStpreSelector = (
  state: RootState,
  props: Object,
) => Map<string, ColonyAdminRecord>;

type ColonyAdminsSelector = (
  state: RootState,
  props: Object,
) => Array<ColonyAdminRecord>;

export const allColonies = (state: RootState) => state[ns].colonies;

export const singleColony = (state: RootState, ensName: ENSName) =>
  allColonies(state).get(ensName);

export const getCurrentColony: CurrentColonySelector = createSelector(
  allColonies,
  (state, props) => (props.colony ? props.colony.ensName : undefined),
  (colonies, ensName) => colonies.get(ensName, {}),
);

export const getColonyAdminStore: ColonyAdminStpreSelector = createSelector(
  getCurrentColony,
  currentColony =>
    currentColony && currentColony.get ? currentColony.get('admins', {}) : {},
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins =>
    Object.keys(colonyAdmins).map(username => colonyAdmins[username]),
);
