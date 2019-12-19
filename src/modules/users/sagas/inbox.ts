import ApolloClient from 'apollo-client';
import { put, takeEvery } from 'redux-saga/effects';

import { ActionTypes, AllActions } from '~redux/index';
import { getContext, Context } from '~context/index';
import { executeQuery, putError } from '~utils/saga/effects';
import {
  ColonySubscribedUsersDocument,
  UserColonyIdsQueryResult,
  getLoggedInUser,
} from '~data/index';

import { getUserInboxActivity } from '../data/queries';

function* inboxItemsFetch() {
  try {
    const { walletAddress } = yield getLoggedInUser();
    const apolloClient: ApolloClient<object> = yield getContext(
      Context.APOLLO_CLIENT,
    );

    const { data }: UserColonyIdsQueryResult = yield apolloClient.query({
      query: ColonySubscribedUsersDocument,
      variables: { address: walletAddress },
    });

    if (!data) {
      throw new Error('Could not get user colonies');
    }

    const {
      user: { colonies },
    } = data;
    const userColonies = colonies.map(({ id }) => id);

    const activities = yield executeQuery(getUserInboxActivity, {
      args: undefined,
      metadata: { walletAddress, userColonies },
    });

    yield put<AllActions>({
      type: ActionTypes.INBOX_ITEMS_FETCH_SUCCESS,
      payload: { activities },
    });
  } catch (error) {
    return yield putError(ActionTypes.INBOX_ITEMS_FETCH_ERROR, error);
  }
  return null;
}

export function* setupInboxSagas() {
  yield takeEvery(ActionTypes.INBOX_ITEMS_FETCH, inboxItemsFetch);
}
