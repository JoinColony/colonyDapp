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
  test('Root reducer organizes properties under data and form', async () => {
    const state = store.getState();
    const numKeys = Object.keys(state).length;
    expect(numKeys).toBe(2);
    expect(state.data).toBeTruthy();
    expect(state.form).toBeTruthy();
  });

  test('Redux holds Data class', async () => {
    const state = store.getState();
    expect(state.data.Data).toBeTruthy();
  });

  test('After action dispatch, the Redux state is updated', async () => {
    store.dispatch(actionSetUserProfileContent('hello'));
    const state = store.getState();
    expect(state.data.my_profile.content).toBe('hello');
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
