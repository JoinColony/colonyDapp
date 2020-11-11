import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getExtensionHash } from '@colony/colony-js';

import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom } from '~utils/saga/effects';
import {
  ColonyExtensionQuery,
  ColonyExtensionQueryVariables,
  ColonyExtensionDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { createTransaction, getTxChannel } from '../../core/sagas';

function* colonyExtensionInstall({
  meta,
  payload: { colonyAddress, extensionId },
}: Action<ActionTypes.COLONY_EXTENSION_INSTALL>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'installExtension',
      identifier: colonyAddress,
      params: [getExtensionHash(extensionId), 1],
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

    yield put<AllActions>({
      type: ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS,
      payload: {},
      meta,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    yield apolloClient.query<
      ColonyExtensionQuery,
      ColonyExtensionQueryVariables
    >({
      query: ColonyExtensionDocument,
      variables: {
        colonyAddress,
        extensionId,
      },
      fetchPolicy: 'network-only',
    });
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_EXTENSION_INSTALL_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

// function* colonyExtensionEnable({
//   meta,
//   payload: { colonyAddress, extensionId },
// }: Action<ActionTypes.COLONY_EXTENSION_INSTALL>) {
//   const txChannel = yield call(getTxChannel, meta.id);

//   try {
//     yield fork(createTransaction, meta.id, {
//       context: ClientType.ColonyClient,
//       methodName: 'installExtension',
//       identifier: colonyAddress,
//       params: [getExtensionHash(extensionId), 1],
//     });

//     yield takeFrom(txChannel, ActionTypes.TRANSACTION_CREATED);

//     yield put<AllActions>({
//       type: ActionTypes.COLONY_EXTENSION_INSTALL_SUCCESS,
//       payload: {},
//       meta,
//     });

//     yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

//     const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

//     yield apolloClient.query<
//       ColonyExtensionQuery,
//       ColonyExtensionQueryVariables
//     >({
//       query: ColonyExtensionDocument,
//       variables: {
//         colonyAddress,
//         extensionId,
//       },
//       fetchPolicy: 'network-only',
//     });
//   } catch (error) {
//     return yield putError(
//       ActionTypes.COLONY_EXTENSION_INSTALL_ERROR,
//       error,
//       meta,
//     );
//   } finally {
//     txChannel.close();
//   }
//   return null;
// }

export default function* colonySagas() {
  yield takeEvery(ActionTypes.COLONY_EXTENSION_INSTALL, colonyExtensionInstall);
}
