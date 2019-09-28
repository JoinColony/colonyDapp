import { Address } from '~types/index';

import { RootStateRecord } from '../../state';
import {
  ADMIN_NAMESPACE as ns,
  ADMIN_TRANSACTIONS,
  ADMIN_UNCLAIMED_TRANSACTIONS,
} from '../constants';
import { FetchableContractTransactionList } from '../state';

/*
 * Input selectors
 */
export const colonyTransactionsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): FetchableContractTransactionList =>
  state.getIn([ns, ADMIN_TRANSACTIONS, colonyAddress]);

export const colonyUnclaimedTransactionsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
): FetchableContractTransactionList =>
  state.getIn([ns, ADMIN_UNCLAIMED_TRANSACTIONS, colonyAddress]);
