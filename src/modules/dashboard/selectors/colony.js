/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName } from '~types';
import type {
  ColonyRecord,
  ColonyAdminRecord,
  DataMap,
  DataRecord,
} from '~immutable';

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

type ColonyAdminStoreSelector = (
  state: RootState,
  ensName: ENSName,
) => ImmutableMapType<string, ColonyAdminRecord>;

type ColonyAdminsSelector = (
  state: RootState,
  ensName: ENSName,
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

export const domainsIndexSelector = createSelector(
  singleColonySelector,
  colony => colony.getIn(['databases', 'domainsIndex']),
);

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

export const getCurrentColony: ColonySelector = createSelector(
  allColoniesSelector,
  (state, props) => (props.colony ? props.colony.ensName : undefined),
  (colonies, ensName) => colonies.get(ensName, ImmutableMap()),
);

export const getColonyAdminStore: ColonyAdminStoreSelector = createSelector(
  singleColonySelector,
  currentColony =>
    currentColony && currentColony.getIn(['record', 'admins'], ImmutableMap()),
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins => (colonyAdmins && colonyAdmins.toList().toArray()) || [],
);
