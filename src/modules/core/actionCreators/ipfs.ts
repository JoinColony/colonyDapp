/* eslint-disable import/prefer-default-export */

import { ActionTypes, AllActions } from '~redux/index';

export const uploadIpfsData = (ipfsData: string, id: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_UPLOAD,
  meta: { id },
  payload: { ipfsData },
});

export const fetchIpfsData = (ipfsHash: string): AllActions => ({
  type: ActionTypes.IPFS_DATA_FETCH,
  meta: { key: ipfsHash },
  payload: { ipfsHash },
});
