import { all, call } from 'redux-saga/effects';

import stakeMotionSaga from './stakeMotion';
import voteMotionSaga from './voteMotion';
import revealVoteMotionSaga from './revealVoteMotion';
import finalizeMotionSaga from './finalizeMotion';
import claimMotionRewardsSaga from './claimMotionRewards';

export default function* actionsSagas() {
  yield all([
    call(stakeMotionSaga),
    call(voteMotionSaga),
    call(revealVoteMotionSaga),
    call(finalizeMotionSaga),
    call(claimMotionRewardsSaga),
  ]);
}
