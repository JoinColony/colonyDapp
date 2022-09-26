import { call } from 'redux-saga/effects';
import { getStringForMetadataAnnotation } from '@colony/colony-event-metadata-parser';

import { ipfsUploadWithFallback } from './ipfsUploadWithFallback';

export function* ipfsUploadAnnotation(annotationMessage: string) {
  const annotationMetadata = getStringForMetadataAnnotation({
    annotationMsg: annotationMessage,
  });

  return yield call(ipfsUploadWithFallback, annotationMetadata);
}
