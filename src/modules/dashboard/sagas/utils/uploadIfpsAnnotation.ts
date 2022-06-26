import { call } from 'redux-saga/effects';
import { getMetadataStringForAnnotation } from '~utils/eventMetadataHandler';
import { ipfsUpload } from '../../../core/sagas/ipfs';

export function* uploadIfpsAnnotation(annotationMessage: string) {
  const annotationMetadata = getMetadataStringForAnnotation({
    annotationMsg: annotationMessage,
  });
  console.log(`🚀 ~ annotationMetadata`, annotationMetadata);

  let ipfsHash: string | null = null;
  ipfsHash = yield call(ipfsUpload, annotationMetadata);

  /* If the ipfs upload failed we try again, then if it fails again we just assign
      an empty string so that the `transactionAddParams` won't fail */
  if (!ipfsHash) {
    ipfsHash = yield call(ipfsUpload, annotationMetadata);
    if (!ipfsHash) {
      ipfsHash = '';
    }
  }

  return ipfsHash;
}
