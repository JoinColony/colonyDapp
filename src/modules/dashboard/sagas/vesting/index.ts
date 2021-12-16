import { all, call } from 'redux-saga/effects';

import claimAllocationSaga from './claimAllocation';
import unwrapTokenSaga from './unwrapToken';

export default function* vestingSagas() {
  yield all([call(claimAllocationSaga), call(unwrapTokenSaga)]);
}
