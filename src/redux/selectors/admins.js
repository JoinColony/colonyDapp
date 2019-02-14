/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import { singleColonySelector } from './colony';

export const getColonyAdminStore = createSelector(
  singleColonySelector,
  currentColony =>
    currentColony && currentColony.getIn(['record', 'admins'], ImmutableMap()),
);

export const getColonyAdmins = createSelector(
  getColonyAdminStore,
  colonyAdmins => (colonyAdmins && colonyAdmins.toList().toArray()) || [],
);
