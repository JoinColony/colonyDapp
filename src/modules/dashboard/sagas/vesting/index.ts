import { all, call } from 'redux-saga/effects';

import claimAllocationSaga from './claimAllocation';

export default function* actionsSagas() {
  yield all([call(claimAllocationSaga)]);
}
