/* @flow */

import type { Map as ImmutableMapType } from 'immutable';

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ENSName, RootState } from '~types';
import type { ColonyAdminRecord } from '~immutable';

import { singleColonySelector } from './colony';

type ColonyAdminStoreSelector = (
  state: RootState,
  ensName: ENSName,
) => ImmutableMapType<string, ColonyAdminRecord>;
type ColonyAdminsSelector = (
  state: RootState,
  ensName: ENSName,
) => Array<ColonyAdminRecord>;

export const getColonyAdminStore: ColonyAdminStoreSelector = createSelector(
  singleColonySelector,
  currentColony =>
    currentColony && currentColony.getIn(['record', 'admins'], ImmutableMap()),
);

export const getColonyAdmins: ColonyAdminsSelector = createSelector(
  getColonyAdminStore,
  colonyAdmins => (colonyAdmins && colonyAdmins.toList().toArray()) || [],
);
