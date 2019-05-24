/* @flow */

import type { Saga } from 'redux-saga';

import { put, takeEvery, select } from 'redux-saga/effects';

import type { Action } from '~redux';

import {
  executeCommand,
  putError /* , executeQuery */,
} from '~utils/saga/effects';
import { ACTIONS } from '~redux';

import {
  walletAddressSelector,
  currentUserMetadataSelector,
} from '../selectors';

import {
  markNotificationsAsRead /* , getUserNotificationMetadata */,
} from '../data/commands';

function* markNotification({
  payload: { readUntil, exceptFor, id },
}: Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION>): Saga<*> {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };

    /* const { readUntil, exceptFor } = yield* executeQuery(getUserNotificationMetadata, {
      metadata,
    }); */

    yield* executeCommand(markNotificationsAsRead, {
      metadata,
      args: {
        id,
        readUntil,
        exceptFor,
      },
    });

    yield put<Action<typeof ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS>>({
      type: ACTIONS.INBOX_MARK_NOTIFICATION_SUCCESS,
      payload: { readUntil, exceptFor, id },
    });
  } catch (error) {
    yield putError(ACTIONS.INBOX_MARK_NOTIFICATION_ERROR, error);
  }
}

export default function* inboxSagas(): Saga<void> {
  yield takeEvery(ACTIONS.INBOX_MARK_NOTIFICATION, markNotification);
}
