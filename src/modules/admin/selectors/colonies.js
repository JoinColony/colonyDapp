/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord, ColonyAdminRecord } from '~immutable';

import { allColonies } from '../../dashboard/selectors';

type RootState = {
  [string]: {
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

export const getCurrentColony: CurrentColonySelector = createSelector(
  allColonies,
  (state, props) => (props.colony ? props.colony.ensName : undefined),
  (colonies, ensName) => colonies.get(ensName, {}),
);

export const getColonyAdminStore: ColonyAdminStpreSelector = createSelector(
  getCurrentColony,
  currentColony => currentColony.get('admins', {}),
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins =>
    Object.keys(colonyAdmins).map(username => colonyAdmins[username]),
);
