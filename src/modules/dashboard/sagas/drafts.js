/* @flow */

import type { Saga } from 'redux-saga';

import {
  all,
  call,
  getContext,
  put,
  select,
  takeEvery,
} from 'redux-saga/effects';

import type { Action, ENSName } from '~types';
import type { DraftId } from '~immutable';
import type { ValidatedKVStore, Store } from '../../../lib/database/stores';

import { putError } from '~utils/saga/effects';

import { set, get, getAll, remove } from '../../../lib/database/commands';

import { draftStoreAddressSelector, allColonyENSNames } from '../selectors';
import { draftStoreBlueprint } from '../stores';
import {
  DRAFT_CREATE,
  DRAFT_CREATE_ERROR,
  DRAFT_CREATE_SUCCESS,
  DRAFT_REMOVE,
  DRAFT_REMOVE_ERROR,
  DRAFT_REMOVE_SUCCESS,
  DRAFT_FETCH,
  DRAFT_FETCH_ALL,
  DRAFT_FETCH_ERROR,
  DRAFT_FETCH_SUCCESS,
  DRAFT_UPDATE,
  DRAFT_UPDATE_ERROR,
  DRAFT_UPDATE_SUCCESS,
} from '../actionTypes';

import {
  ensureColonyIsInState,
  getDraftsIndexStore,
  getOrCreateDraftsIndexStore,
} from './shared';

const getDraftPropsForActionPayload = (
  props: Object,
  draftStore: ValidatedKVStore,
  feedItemsStore?: Store, // TODO set store type when the store is defined
) => ({
  databases: {
    draftStore: draftStore.address.toString(),
    feedItemsStore:
      props.feedItems ||
      (feedItemsStore && feedItemsStore.address.toString()) ||
      undefined,
  },
  ...props,
});

/*
 * Given a colony ENS name and a draft ID, get or create the feed items
 * store for that draft ID.
 */
// eslint-disable-next-line no-unused-vars
function* getOrCreateFeedItemsStore(colonyENSName: ENSName, draftId: DraftId) {
  // TODO actually get or create a store (when the store is defined)
  return yield {
    address: {
      toString() {
        return 'TODO replace me';
      },
    },
  };
}

function* getDraftStoreFromAddress(draftStoreAddress: string): Saga<void> {
  const ddb = yield getContext('ddb');
  // TODO no access controller available yet
  return yield call(
    [ddb, ddb.getStore],
    draftStoreBlueprint,
    draftStoreAddress,
  );
}

function* getDraftStore(
  colonyENSName: ENSName,
  draftId: DraftId,
): Saga<?ValidatedKVStore> {
  /*
   * Firstly, attempt to find the draft store address from the app state.
   */
  let draftStoreAddress = yield select(draftStoreAddressSelector, {
    colonyENSName,
    draftId,
  });

  /*
   * If it wasn't found, use the drafts index store to see if it exists there.
   */
  if (!draftStoreAddress) {
    const draftsIndexStore = yield call(getDraftsIndexStore, colonyENSName);
    yield call([draftsIndexStore, draftsIndexStore.load]);
    draftStoreAddress = yield call(get, draftsIndexStore, draftId);
  }

  /*
   * If we found the draft store address, return the store (without loading it).
   */
  if (draftStoreAddress)
    yield call(getDraftStoreFromAddress, draftStoreAddress);

  /*
   * If we couldn't find any store address, return null.
   */
  return null;
}

function* createDraftStore(colonyENSName: ENSName): Saga<ValidatedKVStore> {
  const ddb = yield getContext('ddb');
  // TODO no access controller available yet
  return yield call([ddb, ddb.createStore], draftStoreBlueprint, {
    meta: {
      colonyENSName,
    },
  });
}

/*
 * Given a drafts index store, a colony ENS name and a draft ID,
 * get or create the draft store.
 */
function* getOrCreateDraftStore(
  colonyENSName: ENSName,
  draftId: DraftId,
): Saga<ValidatedKVStore> {
  /*
   * Get and load the draft store, if it exists already.
   */
  let store = yield call(getDraftStore, colonyENSName, draftId);
  if (store) yield call([store, store.load]);

  /*
   * If necessary, create the draft store.
   */
  if (!store) store = yield call(createDraftStore, colonyENSName);

  return store;
}

function* createDraftSaga({
  payload: {
    colonyENSName,
    props: { id },
    props,
  },
}: Action): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get or create the drafts index store for this colony.
     */
    const draftsIndexStore = yield call(
      getOrCreateDraftsIndexStore,
      colonyENSName,
    );

    /*
     * Get or create the store for this draft.
     */
    const draftStore = yield call(getOrCreateDraftStore, colonyENSName, id);

    /*
     * Get or create the feed items store for this draft.
     */
    const feedItemsStore = yield call(
      getOrCreateFeedItemsStore,
      colonyENSName,
      id,
    );

    /*
     * Set the draft props to the draft store.
     * TODO: ideally guard against re-writing the same values (if this saga
     * failed part-way through before)
     */
    yield call(set, draftStore, {
      feedItems: feedItemsStore.address.toString(),
      ...props,
    });

    /*
     * Add the draft store address to the drafts index store (for this draft ID).
     */
    const draftStoreAddress = draftStore.address.toString();
    yield call(set, draftsIndexStore, id, draftStoreAddress);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: DRAFT_CREATE_SUCCESS,
      payload: {
        keyPath: [colonyENSName, id],
      },
      props: getDraftPropsForActionPayload(props, draftStore, feedItemsStore),
    });
  } catch (error) {
    yield putError(DRAFT_CREATE_ERROR, error);
  }
}

/*
 * Given a colony ENS name a draft ID, fetch the draft from its store.
 * Optionally, the `draftStoreAddress` property can be included in
 * the payload, which allows some steps to be skipped.
 */
function* fetchDraftSaga({
  payload: {
    keyPath: [colonyENSName, draftId],
    keyPath,
    draftStoreAddress,
  },
}: Action): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get and load the draft store.
     */
    const draftStore = draftStoreAddress
      ? yield call(getDraftStoreFromAddress, draftStoreAddress)
      : yield call(getDraftStore, colonyENSName, draftId);
    yield call([draftStore, draftStore.load]);

    /*
     * Get all the values from the draft store.
     */
    const props = yield call(getAll, draftStore);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: DRAFT_FETCH_SUCCESS,
      payload: {
        keyPath,
        props: getDraftPropsForActionPayload(props, draftStore),
      },
    });
  } catch (error) {
    yield putError(DRAFT_FETCH_ERROR, error, { keyPath });
  }
}

/*
 * Given a colony ENS name, dispatch actions to fetch all drafts
 * for that colony.
 */
function* fetchAllDraftsForColony(colonyENSName: ENSName): Saga<void> {
  /*
   * Get and load the drafts index store for this colony.
   */
  const draftsIndexStore = yield call(getDraftsIndexStore, colonyENSName);
  yield call([draftsIndexStore, draftsIndexStore.load]);

  /*
   * Iterate over the draft IDs/store addresses in the index,
   * and dispatch an action to fetch the draft.
   */
  const draftsIndex = yield call(getAll, draftsIndexStore);
  yield all(
    Object.entries(draftsIndex).map(([draftId, draftStoreAddress]) =>
      put({
        type: DRAFT_FETCH,
        payload: {
          keyPath: [colonyENSName, draftId],
          draftStoreAddress,
        },
      }),
    ),
  );
}

/*
 * Given all colonies in the current state, fetch all drafts for all
 * colonies (in parallel).
 */
function* fetchAllDraftsSaga(): Saga<void> {
  const colonyENSNames = yield select(allColonyENSNames);
  yield all(
    colonyENSNames.map(colonyENSName =>
      call(fetchAllDraftsForColony, colonyENSName),
    ),
  );
}

/*
 * Given a colony ENS name, a draft ID and draft props, get the draft store
 * and update it.
 */
function* updateDraftSaga({
  payload: {
    keyPath: [colonyENSName, draftId],
    keyPath,
    props,
  },
}: Action): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Get the draft store.
     */
    const draftStore = yield call(getDraftStore, colonyENSName, draftId);

    /*
     * Set all of the given props on the draft store.
     */
    yield call(set, draftStore, props);

    /*
     * Dispatch the success action.
     */
    yield put({
      type: DRAFT_UPDATE_SUCCESS,
      payload: {
        keyPath,
        props: getDraftPropsForActionPayload(props, draftStore),
      },
    });
  } catch (error) {
    yield putError(DRAFT_UPDATE_ERROR, error, { keyPath });
  }
}

/*
 * Given a colony ENS name and draft ID, remove the draft by unsetting
 * the corresponding key in the drafts index store. The draft store is
 * simply unpinned.
 */
function* removeDraftSaga({
  payload: {
    keyPath: [colonyENSName, draftId],
    keyPath,
  },
}: Action): Saga<void> {
  try {
    yield call(ensureColonyIsInState, colonyENSName);

    /*
     * Stop pinning the draft store, if it could be found.
     * TODO: this would also be the place to disconnect the store,
     * removing it from the DDB cache.
     */
    const draftStore = yield call(getDraftStore, colonyENSName, draftId);
    if (draftStore) yield call([draftStore, draftStore.unpin]);

    /*
     * Remove the entry for this draft on the drafts index store.
     */
    const draftsIndexStore = yield call(getDraftsIndexStore, colonyENSName);
    yield call(remove, draftsIndexStore, draftId);

    /*
     * Dispatch the success action.
     */
    yield put({ type: DRAFT_REMOVE_SUCCESS, payload: { keyPath } });
  } catch (error) {
    yield putError(DRAFT_REMOVE_ERROR, error, { keyPath });
  }
}

export default function* draftsSagas(): any {
  yield takeEvery(DRAFT_CREATE, createDraftSaga);
  yield takeEvery(DRAFT_FETCH, fetchDraftSaga);
  yield takeEvery(DRAFT_FETCH_ALL, fetchAllDraftsSaga);
  yield takeEvery(DRAFT_REMOVE, removeDraftSaga);
  yield takeEvery(DRAFT_UPDATE, updateDraftSaga);
}
