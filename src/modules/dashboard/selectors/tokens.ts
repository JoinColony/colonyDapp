import { FetchableDataRecord, TokenRecord } from '~immutable/index';
import { Address } from '~types/index';

import { RootStateRecord } from '../../state';
import { DASHBOARD_ALL_TOKENS, DASHBOARD_NAMESPACE as ns } from '../constants';

export const tokenSelector = (
  state: RootStateRecord,
  tokenAddress: Address,
): FetchableDataRecord<TokenRecord> =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS, tokenAddress]);

export const allTokensSelector = (state: RootStateRecord) =>
  state.getIn([ns, DASHBOARD_ALL_TOKENS]);
