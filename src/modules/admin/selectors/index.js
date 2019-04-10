/* @flow */

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  ADMIN_NAMESPACE as ns,
  ADMIN_TRANSACTIONS,
  ADMIN_UNCLAIMED_TRANSACTIONS,
} from '../constants';

/*
 * Input selectors
 */
export const colonyTransactionsSelector = (
  state: RootStateRecord,
  colonyName: ENSName,
) => state.getIn([ns, ADMIN_TRANSACTIONS, colonyName]);

export const colonyUnclaimedTransactionsSelector = (
  state: RootStateRecord,
  colonyName: ENSName,
) => state.getIn([ns, ADMIN_UNCLAIMED_TRANSACTIONS, colonyName]);
