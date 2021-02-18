import { all, call } from 'redux-saga/effects';

import paymentActionSaga from './payment';

export default function* actionsSagas() {
  yield all([call(paymentActionSaga)]);
}
