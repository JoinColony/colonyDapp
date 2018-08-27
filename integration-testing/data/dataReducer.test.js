/* eslint-env jest */
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../../src/reducers';
import sagas from '../../src/sagas';

import {
  addCommentToTask,
  addDomainToColony,
  addTaskToDomain,
  addColonyToUserProfile,
  setUserProfileContent,
} from '../../src/actions';

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
    store.dispatch(setUserProfileContent({ greeting: 'hello' }));
    const state = store.getState();
    expect(state.data.my_profile.data.greeting).toBe('hello');
  });

  test('UserProfile shows colony after joining', async () => {
    store.dispatch(addColonyToUserProfile('fakeAddress'));
    const state = store.getState();

    expect(state.data.my_profile.data.colonies[0]).toBe('fakeAddress');
  });

  test('Can add domain to a colony', async () => {
    store.dispatch(addDomainToColony('fakeColony', 'fakeDomain'));
    const state = store.getState();

    expect(state.data.data.colonies['fakeColony'].domains[0]).toBe(
      'fakeDomain',
    );
  });

  test('Can add task to a domain', async () => {
    const task = { title: 'fakeTask', _id: 'fakeTask' };
    store.dispatch(addTaskToDomain('fakeDomain', task));
    const state = store.getState();
    const title = state.data.data.domains['fakeDomain'].tasks[0].title;
    expect(title).toBe('fakeTask');
  });

  test('Can add comment to a task', async () => {
    store.dispatch(addCommentToTask('fakeDomain', 'fakeTask', 'fakeComment'));
    const state = store.getState();
    const comment = state.data.data.domains['fakeDomain'].tasks[0].comments[0];
    expect(comment).toBe('fakeComment');
  });

  test.skip('After login, UserProfile displays recent activity', async () => {});

  test.skip('User can navigate to those colonies from the UserProfile', async () => {});

  test.skip('The colony database holds domain hashes', async () => {});
});
