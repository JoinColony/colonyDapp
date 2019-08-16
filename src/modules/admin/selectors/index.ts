import { Address } from '~types/index';
import { RootStateRecord } from '~immutable/index';

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
  colonyAddress: Address,
) => state.getIn([ns, ADMIN_TRANSACTIONS, colonyAddress]);

export const colonyUnclaimedTransactionsSelector = (
  state: RootStateRecord,
  colonyAddress: Address,
) => state.getIn([ns, ADMIN_UNCLAIMED_TRANSACTIONS, colonyAddress]);
