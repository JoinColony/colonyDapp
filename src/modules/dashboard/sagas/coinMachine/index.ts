import { all, call } from 'redux-saga/effects';

import buyTokensSaga from './buyTokens';

export default function* coinMachineSagas() {
  yield all([call(buyTokensSaga)]);
}
