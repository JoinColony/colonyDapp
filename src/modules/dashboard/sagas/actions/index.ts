import { all, call } from 'redux-saga/effects';

import paymentActionSaga from './payment';
import moveFundsActionSaga from './moveFunds';

export default function* actionsSagas() {
  yield all([call(paymentActionSaga), call(moveFundsActionSaga)]);
}
