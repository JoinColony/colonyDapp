import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { hexlify, hexZeroPad } from 'ethers/utils';

import { ContextModule, TEMP_getContext } from '~context/index';
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

function* managePermissionsMotion({
  payload: {
    colonyAddress,
    domainId,
    userAddress,
    roles,
    colonyName,
    annotationMessage,
    motionDomainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_USER_ROLES_SET>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!userAddress) {
      throw new Error('User address not set for setUserRole transaction');
    }

    if (!domainId) {
      throw new Error('Domain id not set for setUserRole transaction');
    }

    if (!roles) {
      throw new Error('Roles not set for setUserRole transaction');
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const votingReputationClient = yield context.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      domainId,
      domainId === ROOT_DOMAIN_ID ? ColonyRole.Root : ColonyRole.Architecture,
      votingReputationClient.address,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      motionDomainId,
      domainId,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      motionDomainId,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const {
      createMotion,
      annotateSetUserRolesMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateSetUserRolesMotion',
    ]);

    const roleArray = Object.values(roles).reverse();
    roleArray.splice(2, 0, false);

    let roleBitmask = '';

    roleArray.forEach((role) => {
      roleBitmask += role ? '1' : '0';
    });

    const hexString = hexlify(parseInt(roleBitmask, 2));
    const zeroPadHexString = hexZeroPad(hexString, 32);

    const encodedAction = colonyClient.interface.functions.setUserRoles.encode([
      permissionDomainId,
      childSkillIndex,
      userAddress,
      domainId,
      zeroPadHexString,
    ]);

    // create transactions
    yield fork(createTransaction, createMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createMotion',
      identifier: colonyAddress,
      params: [
        motionDomainId,
        motionChildSkillIndex,
        AddressZero,
        encodedAction,
        key,
        value,
        branchMask,
        siblings,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateSetUserRolesMotion.id, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        group: {
          key: batchKey,
          id: metaId,
          index: 1,
        },
        ready: false,
      });
    }

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateSetUserRolesMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);
      yield put(transactionPending(annotateSetUserRolesMotion.id));

      yield put(
        transactionAddParams(annotateSetUserRolesMotion.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateSetUserRolesMotion.id));

      yield takeFrom(
        annotateSetUserRolesMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.MOTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_USER_ROLES_SET_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* managePermissionsMotionSaga() {
  yield takeEvery(ActionTypes.MOTION_USER_ROLES_SET, managePermissionsMotion);
}
