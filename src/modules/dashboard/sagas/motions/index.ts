import { all, call } from 'redux-saga/effects';

import stakeMotionSaga from './stakeMotion';
import voteMotionSaga from './voteMotion';
import revealVoteMotionSaga from './revealVoteMotion';

export default function* actionsSagas() {
  yield all([
    call(stakeMotionSaga),
    call(voteMotionSaga),
    call(revealVoteMotionSaga),
  ]);
}
