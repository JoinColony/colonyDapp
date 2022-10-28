import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { hexlify, hexZeroPad } from 'ethers/utils';
import { ClientType } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { ipfsUploadAnnotation } from '../utils';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

function* managePermissionsAction({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    colonyName,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    if (!userAddress) {
      throw new Error('User address not set for setUserRole transaction');
    }

    if (!domainId) {
      throw new Error('Domain id not set for setUserRole transaction');
    }

    if (!roles) {
      throw new Error('Roles not set for setUserRole transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'setUserRoles';

    const {
      setUserRoles,
      annotateSetUserRoles,
    } = yield createTransactionChannels(metaId, [
      'setUserRoles',
      'annotateSetUserRoles',
    ]);

    const createGroupTransaction = ({ id, index }, config) =>
      fork(createTransaction, id, {
        ...config,
        group: {
          key: batchKey,
          id: metaId,
          index,
        },
      });

    const roleArray = Object.values(roles).reverse();
    roleArray.splice(2, 0, false);

    let roleBitmask = '';

    roleArray.forEach((role) => {
      roleBitmask += role ? '1' : '0';
    });

    const hexString = hexlify(parseInt(roleBitmask, 2));
    const zeroPadHexString = hexZeroPad(hexString, 32);

    yield createGroupTransaction(setUserRoles, {
      context: ClientType.ColonyClient,
      methodName: 'setUserRolesWithProofs',
      identifier: colonyAddress,
      params: [userAddress, domainId, zeroPadHexString],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateSetUserRoles, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateSetUserRoles.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(setUserRoles.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      setUserRoles.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(setUserRoles.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateSetUserRoles.id));

      const annotationMessageIpfsHash = yield call(
        ipfsUploadAnnotation,
        annotationMessage,
      );

      yield put(
        transactionAddParams(annotateSetUserRoles.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateSetUserRoles.id));

      yield takeFrom(
        annotateSetUserRoles.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield put<AllActions>({
      type: ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    yield apolloClient.query<
      ProcessedColonyQuery,
      ProcessedColonyQueryVariables
    >({
      query: ProcessedColonyDocument,
      variables: {
        address: colonyAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_USER_ROLES_SET_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* managePermissionsActionSaga() {
  yield takeEvery(ActionTypes.ACTION_USER_ROLES_SET, managePermissionsAction);
}
