import { all, call } from 'redux-saga/effects';

import signAgreement from './signAgreement';
import updateWhitelistSaga from './updateWhitelist';

export default function* whitelistSagas() {
  yield all([call(signAgreement), call(updateWhitelistSaga)]);
}
