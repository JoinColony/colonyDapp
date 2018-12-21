/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName } from '~types';
import type { ColonyRecord, ColonyAdminRecord } from '~immutable';

import ns from '../namespace';

type RootState = {
  [typeof ns]: {
    colonies: ImmutableMapType<ENSName, ColonyRecord>,
  },
};

type CurrentColonySelector = (state: RootState, props: Object) => ColonyRecord;

type ColonyAdminStoreSelector = (
  state: RootState,
  props: Object,
) => ImmutableMapType<string, ColonyAdminRecord>;

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
  (colonies, ensName) => colonies.get(ensName, ImmutableMap()),
);

export const getColonyAdminStore: ColonyAdminStoreSelector = createSelector(
  getCurrentColony,
  currentColony => currentColony.get('admins', ImmutableMap()),
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins => colonyAdmins.toList().toArray(),
);
