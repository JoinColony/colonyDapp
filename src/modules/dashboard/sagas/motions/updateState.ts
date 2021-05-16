import { put, takeEvery } from 'redux-saga/effects';

import { ActionTypes, AllActions, Action } from '~redux/index';
import { TEMP_getContext, ContextModule } from '~context/index';
import { putError } from '~utils/saga/effects';
import {
  ColonyActionQuery,
  ColonyActionQueryVariables,
  ColonyActionDocument,
} from '~data/index';

function* motionStateUpdate({
  payload: { colonyAddress, transactionHash },
  meta,
}: Action<ActionTypes.COLONY_MOTION_STATE_UPDATE>) {
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Colony Actions (to get the refreshed motion state)
     *
     * @TODO This is a todo for now, since we'll difently need to refactor this
     * to just update the state, and the bring in the whole resolver.
     */
    yield apolloClient.query<ColonyActionQuery, ColonyActionQueryVariables>({
      query: ColonyActionDocument,
      variables: {
        colonyAddress,
        transactionHash,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_STATE_UPDATE_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(ActionTypes.COLONY_MOTION_STATE_UPDATE_ERROR, error);
  }
  return null;
}

export default function* updateMotionStateSaga() {
  yield takeEvery(ActionTypes.COLONY_MOTION_STATE_UPDATE, motionStateUpdate);
}
