/* @flow */
import { createSelector } from 'reselect';

import type { RootStateRecord } from '~immutable';

import { DASHBOARD_NAMESPACE as ns, DASHBOARD_ALL_ADMINS } from '../constants';

/*
 * Getters
 */
const getColonyAdmins = (state: RootStateRecord, ensName: string) =>
  state.getIn([ns, DASHBOARD_ALL_ADMINS, ensName]);

/*
 * Selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const colonyAdminsSelector = createSelector(
  getColonyAdmins,
  domains => domains,
);
