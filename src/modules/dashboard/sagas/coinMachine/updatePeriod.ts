import { put, takeEvery } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  CurrentPeriodTokensDocument,
  CurrentPeriodTokensQuery,
  CurrentPeriodTokensQueryVariables,
} from '~data/index';
import { ActionTypes, Action } from '~redux/index';
import { putError } from '~utils/saga/effects';

function* coinMachinePeriodUpdate({
  payload: { colonyAddress },
}: Action<ActionTypes.COIN_MACHINE_PERIOD_UPDATE>) {
  try {
    /*
    Update token values for the current period
  */
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield apolloClient.query<
      CurrentPeriodTokensQuery,
      CurrentPeriodTokensQueryVariables
    >({
      query: CurrentPeriodTokensDocument,
      variables: { colonyAddress },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.COIN_MACHINE_PERIOD_UPDATE_SUCCESS,
    });
  } catch (error) {
    return yield putError(ActionTypes.COIN_MACHINE_PERIOD_UPDATE_ERROR, error);
  }

  return null;
}

export default function* updateCoinMachinePeriodSage() {
  yield takeEvery(
    ActionTypes.COIN_MACHINE_PERIOD_UPDATE,
    coinMachinePeriodUpdate,
  );
}
