import { all, call } from 'redux-saga/effects';

import buyTokensSaga from './buyTokens';
import updatePeriodSaga from './updatePeriod';

export default function* coinMachineSagas() {
  yield all([call(buyTokensSaga), call(updatePeriodSaga)]);
}
