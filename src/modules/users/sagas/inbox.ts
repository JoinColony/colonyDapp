import ApolloClient from 'apollo-client';
import { put, takeEvery } from 'redux-saga/effects';

import { ActionTypes, AllActions } from '~redux/index';
import { getContext, Context } from '~context/index';
import { putError } from '~utils/saga/effects';
import {
  getLoggedInUser,
  UserNotificationsDocument,
  UserNotificationsQueryResult,
} from '~data/index';

function* inboxItemsFetch() {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data }: UserNotificationsQueryResult = yield apolloClient.query({
      query: UserNotificationsDocument,
      variables: { address: walletAddress },
    });

    if (!data) {
      throw new Error('Could not get user notifications');
    }

    yield put<AllActions>({
      type: ActionTypes.INBOX_ITEMS_FETCH_SUCCESS,
      payload: {
        activities: data.user.notifications,
        currentUser: walletAddress,
      },
    });
  } catch (error) {
    return yield putError(ActionTypes.INBOX_ITEMS_FETCH_ERROR, error);
  }
  return null;
}

export function* setupInboxSagas() {
  yield takeEvery(ActionTypes.INBOX_ITEMS_FETCH, inboxItemsFetch);
}
