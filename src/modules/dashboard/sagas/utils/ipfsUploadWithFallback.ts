import { call } from 'redux-saga/effects';
import { ColonySafe } from '~data/generated';
import { SafeTransaction } from '~redux/types/actions/colonyActions';
import { log } from '~utils/debug';

import { ipfsUpload } from '../../../core/sagas/ipfs';

interface SafeTxData {
  title: string;
  transactions: SafeTransaction[];
  safe: ColonySafe;
  annotationMessage?: string;
}

export function* ipfsUploadWithFallback(payload: string | SafeTxData) {
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
