/* @flow */

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';

import type { ColonyRecordType, DataRecordType } from '~immutable';

import { singleColonySelector } from './colony';
import { getUsers } from '../../users/selectors';

const getColonyAdmins = (colony: DataRecordType<ColonyRecordType>) =>
  colony ? colony.getIn(['record', 'admins'], ImmutableMap()) : ImmutableMap();

// eslint-disable-next-line import/prefer-default-export
export const colonyAdminsSelector = createSelector(
  singleColonySelector,
  getColonyAdmins,
  getUsers,
  (colony, admins, users) =>
    users.filter((_, address) => admins && admins.has(address)).toList(),
);
