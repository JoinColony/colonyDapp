import { call, fork, put, takeEvery } from 'redux-saga/effects';
import {
  ClientType,
  ROOT_DOMAIN_ID,
  getPermissionProofs,
  getChildIndex,
  ColonyRole,
} from '@colony/colony-js';
import { getStringForMetadataDomain } from '@colony/colony-event-metadata-parser';

import { AddressZero } from 'ethers/constants';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { ipfsUploadWithFallback, ipfsUploadAnnotation } from '../utils';
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

function* createEditDomainMotion({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domainId: editDomainId,
    isCreateDomain,
    parentId = ROOT_DOMAIN_ID,
    motionDomainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_DOMAIN_CREATE_EDIT>) {
  let txChannel;
  try {
    /*
     * Validate the required values
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

    if (!isCreateDomain && !editDomainId) {
      throw new Error('A domain id is required to edit domain');
    }
    /* additional editDomain check is for the TS to not ring alarm in getPermissionProofs */
    const domainId = !isCreateDomain && editDomainId ? editDomainId : parentId;

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
      ColonyRole.Architecture,
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
      annotateMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateMotion',
    ]);

    /*
     * Upload domain metadata to IPFS
     */
    let domainMetadataIpfsHash = null;
    domainMetadataIpfsHash = yield call(
      ipfsUploadWithFallback,
      getStringForMetadataDomain({
        domainName,
        domainColor,
        domainPurpose,
      }),
    );

    const encodedAction = colonyClient.interface.functions[
      isCreateDomain
        ? 'addDomain(uint256,uint256,uint256,string)'
        : 'editDomain'
    ].encode([
      permissionDomainId,
      childSkillIndex,
      domainId,
      domainMetadataIpfsHash,
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
      yield fork(createTransaction, annotateMotion.id, {
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
      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_CREATED);
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

      yield put(transactionPending(annotateMotion.id));

      yield put(transactionAddParams(annotateMotion.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateMotion.id));

      yield takeFrom(annotateMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    }
    yield put<AllActions>({
      type: ActionTypes.MOTION_DOMAIN_CREATE_EDIT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.MOTION_DOMAIN_CREATE_EDIT_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

export default function* createEditDomainMotionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_DOMAIN_CREATE_EDIT,
    createEditDomainMotion,
  );
}
