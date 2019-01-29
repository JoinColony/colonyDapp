/* @flow */

import type { ENSName } from '~types';
import type { RootStateRecord } from '~immutable';

import {
  ADMIN_NAMESPACE as ns,
  ADMIN_TRANSACTIONS,
  ADMIN_UNCLAIMED_TRANSACTIONS,
} from '../constants';

export const colonyTransactions = (state: RootStateRecord, ensName: ENSName) =>
  state.getIn([ns, ADMIN_TRANSACTIONS, ensName]);

export const colonyUnclaimedTransactions = (
  state: RootStateRecord,
  ensName: ENSName,
) => state.getIn([ns, ADMIN_UNCLAIMED_TRANSACTIONS, ensName]);
