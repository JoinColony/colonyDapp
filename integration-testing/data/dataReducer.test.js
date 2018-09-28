/* eslint-env jest */
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { sleep } from '../../src/utils/time';
import reducers from '../../src/reducers';
import sagas from '../../src/sagas';

import {
  addColonyToUserProfile,
  addCommentToTask,
  addDomainToColony,
  addTaskToDomain,
  updateColony,
  editDomain,
  editTask,
  fetchCommentsForTask,
  initializeData,
  fetchColony,
  loadDomain,
  setUserProfileContent,
} from '../../src/actions';

let store;
const rootRepo = '/tmp/dataTests';

beforeAll(async () => {
  const sagaMiddleware = createSagaMiddleware();

  const createStoreWithMiddleware = applyMiddleware(sagaMiddleware)(
    createStore,
  );

  store = createStoreWithMiddleware(reducers, {});

  sagaMiddleware.run(sagas);

  await initializeData(store.dispatch, rootRepo).then(result =>
    console.log(result),
  );
});

// TODO don't think this actually works as it does not log
//      intent is to clear out store between runs
afterAll(async () => {
  const state = store.getState();
  await state.data.Data.clear(rootRepo).then(result =>
    console.log("all clear cap'n", result),
  );
});

describe('Data reducer', () => {
  test('Redux holds Data class', async () => {
    const state = store.getState();
    expect(state.data.Data).toBeTruthy();
  });

  test('Data class works normally', async () => {
    const state = store.getState();
    const joined = await state.data.Data.joinColony('myColony'); // returns true
    expect(joined).toBe('myColony');
  });

  test('After action dispatch, the Redux state is updated', async () => {
    store.dispatch(
      setUserProfileContent({ property: 'greeting', value: 'hello' }),
    );
    store.dispatch(setUserProfileContent({ property: 'name', value: 'Geo' }));
    const state = store.getState();

    expect(state.data.my_profile.data.greeting).toBe('hello');
    expect(state.data.my_profile.data.name).toBe('Geo');
  });

  // TODO change to use image after IPFS and images work
  test('Can update user avatar', async () => {
    store.dispatch(
      setUserProfileContent({ property: 'avatar', value: 'arty' }),
    );

    const state = store.getState();
    expect(state.data.my_profile.data.avatar).toBe('arty');
  });

  // TODO figure out why this almost works
  // comment out this line in dataSagas:
  // const joinedColony = yield call(dataAPI.joinColony, colonyId);
  // The reducer will now fire.
  // Yet Data class test above works
  test('UserProfile shows colony after joining', async () => {
    store.dispatch(addColonyToUserProfile('fakeAddress'));
    const state = store.getState();
    expect(state.data.my_profile.data.colonies[0]).toBe('fakeAddress');
  });

  // TODO dataAPI isn't loading kvstore
  test.skip("Fetches a colony's metadata", async () => {
    store.dispatch(fetchColony('fakeColony'));
    const state = store.getState();
    const colonyID = state.data.data.colonies['fakeColony'].id;
    expect(colonyID).toBe('fakeColony');
  });

  test.skip('Can add domain to a colony', async () => {
    store.dispatch(addDomainToColony('fakeColony', 'fakeDomain'));
    const state = store.getState();
    expect(state.data.data.colonies).toBe('fakeDomain');

    /* expect(state.data.data.colonies['fakeColony'].domains[0]).toBe(
     *   'fakeDomain',
     * );*/
  });

  test.skip('Can add task to a domain', async () => {
    const task = { title: 'fakeTask', _id: 'fakeTask', tags: [], comments: [] };
    store.dispatch(addTaskToDomain('fakeDomain', task));
    const state = store.getState();
    const title = state.data.data.domains['fakeDomain'].tasks[0].title;
    expect(title).toBe('fakeTask');
  });

  test.skip('Task comment are empty after fetch if no comments', async () => {
    store.dispatch(fetchCommentsForTask('fakeDomain', 'fakeTask'));
    const state = store.getState();
    const comments = state.data.data.domains['fakeDomain'].tasks[0].comments;
    console.log(state.data.data.domains['fakeDomain'].tasks);
    expect(comments.length).toBe(0);
  });

  test.skip('Can add comment to a task', async () => {
    store.dispatch(
      addCommentToTask('fakeDomain', 'fakeTask', {
        property: 'comments',
        value: 'fakeComment',
      }),
    );

    const state = store.getState();
    const comment = state.data.data.domains['fakeDomain'].tasks[0].comments[0];
    expect(comment).toBe('fakeComment');
  });

  test.skip("Fetches a task's comments", async () => {
    const state = store.getState();
    store.dispatch(fetchCommentsForTask('fakeDomain', 'fakeTask'));
    const comment = state.data.data.domains['fakeDomain'].tasks[0].comments[0];
    expect(comment).toBe('fakeComment');
  });

  test.skip("Updates a colony's simple properties", async () => {
    store.dispatch(
      updateColony('fakeColony', { property: 'name', value: 'hello' }),
    );
    const state = store.getState();
    const colonyName = state.data.data.colonies['fakeColony'].name;
    expect(colonyName).toBe('hello');
  });

  test.skip("Updates a domain's simple properties", async () => {
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

  test.skip("Updates a task's simple properties", async () => {
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

  test.skip("Fetches a domain's metadata", async () => {
    store.dispatch(loadDomain('fakeDomain'));
    const state = store.getState();
    const domainID = state.data.data.domains['fakeDomain'].id;
    const domainName = state.data.data.domains['fakeDomain'].name;
    expect(domainID).toBe('fakeDomain');
    expect(domainName).toBe('biotech');
  });

  test.skip('After login, UserProfile displays recent activity', async () => {});

  test.skip('User can navigate to those colonies from the UserProfile', async () => {});

  test.skip('The colony database holds domain hashes', async () => {});
});
