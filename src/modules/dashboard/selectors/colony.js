/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName, RootState } from '~types';

import ns from '../namespace';

type ENSNameFromRouter = (state: RootState, props: Object) => ENSName;

export const ensNameFromRouter: ENSNameFromRouter = (state, props) =>
  props.match.params.ensName;

export const allColoniesSelector = (state: RootState) => state[ns].allColonies;

export const coloniesSelector = (state: RootState) =>
  allColoniesSelector(state).colonies;

export const colonyAvatarsSelector = (state: RootState) =>
  allColoniesSelector(state).avatars;

export const routerColonySelector = createSelector(
  coloniesSelector,
  ensNameFromRouter,
  (colonies, ensName) => colonies.get(ensName),
);

export const singleColonySelector = (state: RootState, ensName: ENSName) =>
  coloniesSelector(state).get(ensName);

export const domainsIndexSelector = createSelector(
  singleColonySelector,
  colony =>
    colony ? colony.getIn(['record', 'databases', 'domainsIndex']) : undefined,
);

export const currentColonyAvatarHashSelector = createSelector(
  coloniesSelector,
  (state, props) => props.ensName,
  (colonies, ensName) => colonies.getIn([ensName, 'record', 'avatar']),
);

export const currentColonyAvatarDataSelector = createSelector(
  currentColonyAvatarHashSelector,
  colonyAvatarsSelector,
  (hash, avatars) => avatars.get(hash),
);

export const getCurrentColony = createSelector(
  allColoniesSelector,
  (state, props) => (props.colony ? props.colony.ensName : undefined),
  ({ colonies }, ensName) =>
    ensName ? colonies.get(ensName, ImmutableMap()) : ImmutableMap(),
);

export const getColonyAdminStore = createSelector(
  singleColonySelector,
  currentColony =>
    currentColony && currentColony.getIn(['record', 'admins'], ImmutableMap()),
);

export const getColonyAdmins = createSelector(
  getColonyAdminStore,
  colonyAdmins => (colonyAdmins && colonyAdmins.toList().toArray()) || [],
);
