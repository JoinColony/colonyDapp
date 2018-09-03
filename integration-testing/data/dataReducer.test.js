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
  editColony,
  editDomain,
  editTask,
  fetchCommentsForTask,
  loadColony,
  loadDomain,
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

  // TODO add permissions
  test('After action dispatch, the Redux state is updated', async () => {
    store.dispatch(setUserProfileContent({ greeting: 'hello' }));
    store.dispatch(setUserProfileContent({ name: 'Geo' }));
    const state = store.getState();
    expect(state.data.my_profile.data.greeting).toBe('hello');
    expect(state.data.my_profile.data.name).toBe('Geo');
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
    const task = { title: 'fakeTask', _id: 'fakeTask', tags: [] };
    store.dispatch(addTaskToDomain('fakeDomain', task));
    const state = store.getState();
    const title = state.data.data.domains['fakeDomain'].tasks[0].title;
    expect(title).toBe('fakeTask');
  });

  test('Can add comment to a task', async () => {
    store.dispatch(addCommentToTask('fakeDomain', 'fakeTask', 'fakeComment'));
    const state = store.getState();
    const comment =
      state.data.data.domains['fakeDomain'].tasks[0].commentHashes[0];
    expect(comment).toBe('fakeComment');
  });

  test("Fetches a task's comments", async () => {
    store.dispatch(fetchCommentsForTask('fakeDomain', 'fakeTask'));
    const state = store.getState();
    const comment = state.data.data.domains['fakeDomain'].tasks[0].comments[0];
    expect(comment).toBe('fakeComment');
  });

  test("Fetches a colony's metadata", async () => {
    store.dispatch(loadColony('fakeColony'));
    const state = store.getState();
    const colonyID = state.data.data.colonies['fakeColony'].id;
    expect(colonyID).toBe('fakeColony');
  });

  test("Updates a colony's simple properties", async () => {
    store.dispatch(
      editColony('fakeColony', { property: 'name', value: 'hello' }),
    );
    const state = store.getState();
    const colonyName = state.data.data.colonies['fakeColony'].name;
    expect(colonyName).toBe('hello');
  });

  test("Updates a domain's simple properties", async () => {
    store.dispatch(
      editDomain('fakeDomain', { property: 'name', value: 'hello' }),
    );
    store.dispatch(
      editDomain('fakeDomain', { property: 'color', value: 'blue' }),
    );
    const state = store.getState();
    const domainName = state.data.data.domains['fakeDomain'].name;
    const domainColor = state.data.data.domains['fakeDomain'].color;
    expect(domainName).toBe('hello');
    expect(domainColor).toBe('blue');
  });

  test("Updates a task's simple properties", async () => {
    store.dispatch(
      editTask('fakeDomain', 'fakeTask', { property: 'title', value: 'hello' }),
    );
    store.dispatch(
      editTask('fakeDomain', 'fakeTask', { property: 'bounty', value: 20 }),
    );
    store.dispatch(
      editTask('fakeDomain', 'fakeTask', {
        property: 'tags',
        value: 'dancing',
      }),
    );

    const state = store.getState();
    const title = state.data.data.domains['fakeDomain'].tasks[0].title;
    const bounty = state.data.data.domains['fakeDomain'].tasks[0].bounty;
    const tag = state.data.data.domains['fakeDomain'].tasks[0].tags[0];
    expect(title).toBe('hello');
    expect(bounty).toBe(20);
    expect(tag).toBe('dancing');
  });

  test("Fetches a domain's metadata", async () => {
    store.dispatch(loadDomain('fakeDomain'));
    const state = store.getState();
    const domainID = state.data.data.domains['fakeDomain'].id;
    const domainName = state.data.data.domains['fakeDomain'].name;
    expect(domainID).toBe('fakeDomain');
    expect(domainName).toBe('biotech');
  });

  // TODO change to use image after IPFS and images work
  test('Can update user avatar', async () => {
    store.dispatch(setUserProfileContent({ avatar: 'arty' }));

    const state = store.getState();
    expect(state.data.my_profile.data.avatar).toBe('arty');
  });

  test.skip('After login, UserProfile displays recent activity', async () => {});

  test.skip('User can navigate to those colonies from the UserProfile', async () => {});

  test.skip('The colony database holds domain hashes', async () => {});
});
