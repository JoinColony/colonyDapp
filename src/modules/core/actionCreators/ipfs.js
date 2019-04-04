/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const uploadIpfsData = (
  ipfsData: string,
  id: string,
): Action<typeof ACTIONS.IPFS_DATA_UPLOAD> => ({
  type: ACTIONS.IPFS_DATA_UPLOAD,
  meta: {
    id,
  },
  payload: { ipfsData },
});

export const fetchIpfsData = (
  ipfsHash: string,
): Action<typeof ACTIONS.IPFS_DATA_FETCH> => ({
  type: ACTIONS.IPFS_DATA_FETCH,
  meta: { keyPath: [ipfsHash] },
  payload: { ipfsHash },
});
