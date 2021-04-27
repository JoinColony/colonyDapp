import { all, call } from 'redux-saga/effects';

import stakeMotionSaga from './stakeMotion';

export default function* actionsSagas() {
  yield all([call(stakeMotionSaga)]);
}
