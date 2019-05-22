/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery, select } from 'redux-saga/effects';

import type { Action } from '~redux';

import { executeCommand, putError } from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import {
  walletAddressSelector,
  currentUserMetadataSelector,
} from '../selectors';

import { markNotificationsAsRead } from '../data/commands';

function* markNotification({
  payload: { readUntil, exceptFor },
}: Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION>): Saga<*> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };
    yield* executeCommand(markNotificationsAsRead, {
      metadata,
      args: {
        readUntil,
        exceptFor,
      },
    });

    yield put<Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS>>({
      type: ACTIONS.USER_FETCH_SUCCESS,
      payload: { readUntil, exceptFor },
    });
  } catch (error) {
    yield putError(ACTIONS.USER_FETCH_ERROR, error);
  }
}

export default function* inboxSagas(): Saga<void> {
  yield takeEvery(ACTIONS.USER_FETCH, markNotification);
}
