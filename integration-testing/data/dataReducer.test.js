/* eslint-env jest */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../../src/reducers';
import sagas from '../../src/sagas';

import {
  actionAddColonyToUserProfile,
  actionSetUserProfileContent,
} from '../../src/reducers/dataReducer.js';

let store;
beforeAll(async () => {
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(
    createStore,
  );

  store = createStoreWithMiddleware(reducers, {});

  sagaMiddleware.run(sagas);
});

describe('Data reducer', () => {
  test('After action dispatch, the Redux state is updated', async () => {
    store.dispatch(actionSetUserProfileContent('hello'));
    const state = store.getState();
    expect(state.data.my_profile.content).toBe('hello');
  });

  test('Redux holds Data class', async () => {
    const state = store.getState();
    expect(state.Data).toBeTruthy();
  });

  test('UserProfile shows colony after joining', async () => {
    store.dispatch(actionAddColonyToUserProfile('fakeAddress'));
    const state = store.getState();
    expect(state.data.my_profile.content).toBe('whaat');
  });

  test.skip('After login, UserProfile displays recent activity', async () => {});

  test.skip('UserProfile shows colonies of which the user is a member', async () => {});

  test.skip('User can navigate to those colonies from the UserProfile', async () => {});

  test.skip('The colony database holds domain hashes', async () => {});
});
