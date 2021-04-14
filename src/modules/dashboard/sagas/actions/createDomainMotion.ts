import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  getPermissionProofs,
  ColonyRole,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';

import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../../core/sagas';
import { ipfsUpload } from '../../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';

function* createAddDomainMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    parentId = ROOT_DOMAIN_ID,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_MOTION_DOMAIN_CREATE>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      parentId,
      ColonyRole.Architecture,
    );

    const { skillId } = yield call(
      [colonyClient, colonyClient.getDomain],
      ROOT_DOMAIN_ID,
    );

    const { key, value, branchMask, siblings } = yield call(
      colonyClient.getReputation,
      skillId,
      AddressZero,
    );

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'createRootMotion';

    const {
      createRootMotion,
      annotateCreateDomainMotion,
    } = yield createTransactionChannels(metaId, [
      'createRootMotion',
      'annotateCreateDomainMotion',
    ]);

    /*
     * Upload domain metadata to IPFS
     */
    let domainMetadataIpfsHash = null;
    domainMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        domainName,
        domainColor,
        domainPurpose,
      }),
    );

    const encodedAction = colonyClient.interface.functions[
      'addDomain(uint256,uint256,uint256,string)'
    ].encode([
      permissionDomainId,
      childSkillIndex,
      parentId,
      domainMetadataIpfsHash,
    ]);

    // create transactions
    yield fork(createTransaction, createRootMotion.id, {
      context: ClientType.VotingReputationClient,
      methodName: 'createRootMotion',
      identifier: colonyAddress,
      params: [AddressZero, encodedAction, key, value, branchMask, siblings],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateCreateDomainMotion.id, {
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

    yield takeFrom(createRootMotion.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateDomainMotion.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    let ipfsHash = null;
    ipfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        annotationMessage,
      }),
    );

    yield put(transactionReady(createRootMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createRootMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createRootMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateCreateDomainMotion.id));

      yield put(
        transactionAddParams(annotateCreateDomainMotion.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateCreateDomainMotion.id));

      yield takeFrom(
        annotateCreateDomainMotion.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }
    yield put<AllActions>({
      type: ActionTypes.COLONY_MOTION_DOMAIN_CREATE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.COLONY_MOTION_DOMAIN_CREATE_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createDomainMotionSaga() {
  yield takeEvery(
    ActionTypes.COLONY_MOTION_DOMAIN_CREATE,
    createAddDomainMotion,
  );
}
