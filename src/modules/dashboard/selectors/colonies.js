/* @flow */

import type { Map as ImmutableMap } from 'immutable';

import { createSelector } from 'reselect';

import type { ENSName } from '~types';
import type { ColonyRecord, ColonyAdminRecord, DataMap, DataRecord } from '~immutable';

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

type ColonyAdminStpreSelector = (
  state: RootState,
  props: Object,
) => Map<string, ColonyAdminRecord>;

type ColonyAdminsSelector = (
  state: RootState,
  props: Object,
) => Array<ColonyAdminRecord>;

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

export const getCurrentColony: CurrentColonySelector = createSelector(
  allColoniesSelector,
  (state, props) => (props.colony ? props.colony.ensName : undefined),
  (colonies, ensName) => colonies.get(ensName, {}),
);

export const getColonyAdminStore: ColonyAdminStpreSelector = createSelector(
  singleColonySelector,
  currentColony =>
    currentColony && currentColony.get ? currentColony.get('admins', {}) : {},
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins =>
    Object.keys(colonyAdmins).map(username => colonyAdmins[username]),
);
