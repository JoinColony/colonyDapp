import { all, call } from 'redux-saga/effects';

import buyTokensSaga from './buyTokens';
import updatePeriodSaga from './updatePeriod';
import extensionEnableSaga from './extensionEnable';

export default function* coinMachineSagas() {
  yield all([
    call(buyTokensSaga),
    call(updatePeriodSaga),
    call(extensionEnableSaga),
  ]);
}
