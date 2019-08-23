import { put, takeEvery, select } from 'redux-saga/effects';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { executeCommand, executeQuery, putError } from '~utils/saga/effects';
import {
  walletAddressSelector,
  currentUserMetadataSelector,
  inboxItemsSelector,
} from '../selectors';
import { getUserNotificationMetadata } from '../data/queries';
import { markNotificationsAsRead } from '../data/commands';

function* markAllNotificationsAsRead() {
  try {
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };

    const readUntil = Date.now();
    yield executeCommand(markNotificationsAsRead, {
      metadata,
      args: {
        readUntil,
        exceptFor: [],
      },
    });

    yield put<AllActions>({
      type: ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_SUCCESS,
      payload: {
        readUntil,
        exceptFor: [],
      },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ_ERROR,
      error,
    );
  }
  return null;
}

/*  We use a timestamp here for the item being marked as read */
function* markNotificationAsRead({
  payload: { id, timestamp },
}: Action<ActionTypes.INBOX_MARK_NOTIFICATION_READ>) {
  try {
    const activities = yield select(inboxItemsSelector);
    const walletAddress = yield select(walletAddressSelector);
    const { metadataStoreAddress } = yield select(currentUserMetadataSelector);
    const metadata = {
      walletAddress,
      metadataStoreAddress,
    };

    /* @NOTE: The reason why we don't wanna use ids to mark notifications as read
     * is because that's gonna make the user metadata store grow up in volume
     * pretty quickly. If we do it like this, we'll have fewer writes and a
     * smaller store
     */
    const {
      readUntil: currentReadUntil = 0,
      exceptFor: currentExceptFor = [],
    } = yield executeQuery(getUserNotificationMetadata, {
      metadata,
    });

    /* For each user activity in state, get their id */
    const inboxItems = activities.map(activity => ({
      id: activity.get('id'),
      timestamp: activity.get('timestamp'),
    }));

    /* If the activity is not found, do nothing */
    if (!(inboxItems && inboxItems.some(item => item.id === id))) {
      return null;
    }

    const exceptFor =
      Array.from(new Set([...inboxItems, ...currentExceptFor]))
        .filter(({ id: activityId }) => activityId && activityId !== id)
        .filter(
          ({ timestamp: activityTimeStamp }) =>
            new Date(activityTimeStamp) <= new Date(timestamp) &&
            new Date(activityTimeStamp) > new Date(currentReadUntil),
        )
        .map(({ id: activityId }) => activityId) || [];

    if (
      exceptFor.length === currentExceptFor.length &&
      exceptFor.every(item => currentExceptFor.includes(item)) &&
      timestamp <= currentReadUntil
    ) {
      return null;
    }

    const readUntil =
      timestamp > 0
        ? Math.max(timestamp, currentReadUntil)
        : currentReadUntil || Date.now();

    yield executeCommand(markNotificationsAsRead, {
      metadata,
      args: {
        readUntil,
        exceptFor,
      },
    });

    yield put<AllActions>({
      type: ActionTypes.USER_NOTIFICATION_METADATA_FETCH_SUCCESS,
      payload: {
        readUntil,
        exceptFor,
      },
    });

    yield put<AllActions>({
      type: ActionTypes.INBOX_MARK_NOTIFICATION_READ_SUCCESS,
      payload: { readUntil, exceptFor },
    });
  } catch (error) {
    return yield putError(
      ActionTypes.INBOX_MARK_NOTIFICATION_READ_ERROR,
      error,
    );
  }
  return null;
}

export function* setupInboxSagas() {
  yield takeEvery(
    ActionTypes.INBOX_MARK_NOTIFICATION_READ,
    markNotificationAsRead,
  );
  yield takeEvery(
    ActionTypes.INBOX_MARK_ALL_NOTIFICATIONS_READ,
    markAllNotificationsAsRead,
  );
}
