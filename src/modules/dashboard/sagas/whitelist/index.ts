import { all, call } from 'redux-saga/effects';

import signAgreement from './signAgreement';

export default function* whitelistSagas() {
  yield all([call(signAgreement)]);
}
