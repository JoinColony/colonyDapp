/* @flow */

import type { RootStateRecord } from '~immutable';

import { CORE_NAMESPACE as ns, CORE_IPFS_DATA } from '../constants';

/*
 * Input selectors
 */
// eslint-disable-next-line import/prefer-default-export
export const ipfsDataSelector = (state: RootStateRecord, ipfsHash: string) =>
  state.getIn([ns, CORE_IPFS_DATA, ipfsHash]);
