import { all, call } from 'redux-saga/effects';

import mintTokensMetaActionSaga from './mintTokens';

export default function* metaActionsSagas() {
  yield all([call(mintTokensMetaActionSaga)]);
}
