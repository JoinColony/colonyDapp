import { call } from 'redux-saga/effects';
import { ColonySafe } from '~data/generated';
import { SafeTransaction } from '~redux/types/actions/colonyActions';
import { ipfsUpload } from '../../../core/sagas/ipfs';

interface SafeTxData {
  title: string;
  transactions: SafeTransaction[];
  safeData: Omit<ColonySafe, 'safeName' | 'moduleContractAddress'>;
  annotationMessage?: string;
}

export function* uploadIfpsAnnotation(annotationMessage: string | SafeTxData) {
  let ipfsHash: string | null = null;
  ipfsHash = yield call(
    ipfsUpload,
    JSON.stringify({
      annotationMessage,
    }),
  );

  /* If the ipfs upload failed we try again, then if it fails again we just assign
      an empty string so that the `transactionAddParams` won't fail */
  if (!ipfsHash) {
    ipfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        annotationMessage,
      }),
    );
    if (!ipfsHash) {
      ipfsHash = '';
    }
  }

  return ipfsHash;
}
