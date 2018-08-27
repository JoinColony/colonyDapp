import { put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import Data from '../data';

import { initialData, setUserProfileContent } from '../actions';

import {
  ADD_DOMAIN_TO_COLONY,
  JOIN_COLONY,
  SET_COLONY_CONTENT,
  SET_PROFILE_CONTENT,
} from '../actions/actionConstants';

function* joinColony(action) {
  const { colonyId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.joinColony(colonyId);

  yield put({
    type: SET_PROFILE_CONTENT,
    payload: {
      content: [colonyId],
      target: 'colonies',
    },
  });
}

function* addColonyDomain(action) {
  const { colonyId, domainId } = action.payload;
  const Data = yield select(state => state.data.Data);
  // yield Data.addColonyDomain(colonyId, domainId);

  yield put({
    type: SET_COLONY_CONTENT,
    payload: {
      content: { domains: [domainId] },
      target: colonyId,
    },
  });
}
  yield put({
    type: 'SET_PROFILE_CONTENT',
    content: 'whaat',
  });
}

function* initializeData() {
  const data = yield Data.fromDefaultConfig('no pinner', {
    ipfs: {
      swarm: ['/ip4/0.0.0.0/tcp/0'],

      repo: `/tmp/tests/time/ipfs/ipfs`,
    },
    orbit: {
      repo: `/tmp/tests/time/ipfs/orbit`,
    },
  });
  // yield data.ready();
  const action = initialData(data);
  yield put(action);
}

function* colonySagas() {
  yield initializeData();
  yield takeEvery(JOIN_COLONY, joinColony);
  yield takeEvery(ADD_DOMAIN_TO_COLONY, addColonyDomain);
}

export default colonySagas;
