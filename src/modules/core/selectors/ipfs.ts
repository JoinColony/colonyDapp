import { RootStateRecord } from '~immutable/index';

import { CORE_NAMESPACE as ns, CORE_IPFS_DATA } from '../constants';

/*
 * Input selectors
 */
export const ipfsDataSelector = (state: RootStateRecord, ipfsHash: string) =>
  state.getIn([ns, CORE_IPFS_DATA, ipfsHash]);
