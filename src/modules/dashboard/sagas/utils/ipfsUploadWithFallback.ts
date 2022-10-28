import { call } from 'redux-saga/effects';

import { log } from '~utils/debug';

import { ipfsUpload } from '../../../core/sagas/ipfs';

export function* ipfsUploadWithFallback(payload: string) {
  let ipfsHash: string | null = null;
  try {
    ipfsHash = yield call(ipfsUpload, payload);
  } catch (error) {
    log.verbose('Could not upload the colony metadata IPFS. Retrying...');
    log.verbose(error);
  }

  /* If the ipfs upload failed we try again, then if it fails again we just assign
      an empty string so that the `transactionAddParams` won't fail */
  if (!ipfsHash) {
    ipfsHash = yield call(ipfsUpload, payload);
    if (!ipfsHash) {
      ipfsHash = '';
    }
  }

  return ipfsHash;
}
