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
  ensName: ENSName,
) => state.getIn([ns, ADMIN_TRANSACTIONS, ensName]);

export const colonyUnclaimedTransactionsSelector = (
  state: RootStateRecord,
  ensName: ENSName,
) => state.getIn([ns, ADMIN_UNCLAIMED_TRANSACTIONS, ensName]);
