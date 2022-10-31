import {
  ClientType,
  ColonyClient,
  getChildIndex,
  ROOT_DOMAIN_ID,
} from '@colony/colony-js';
import { AddressZero } from 'ethers/constants';
import { fill } from 'lodash';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

import { ContextModule, TEMP_getContext } from '~context/index';
import { TransactionTypes } from '~dashboard/Dialogs/ControlSafeDialog/constants';
import {
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
} from '~data/generated';
import ColonyManager from '~lib/ColonyManager';
import {
  transactionAddParams,
  transactionPending,
  transactionReady,
} from '~modules/core/actionCreators';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '~modules/core/sagas';
import { getColonyManager } from '~modules/core/sagas/utils';
import { ActionTypes } from '~redux/actionTypes';
import { Action, AllActions } from '~redux/types';
import { putError, routeRedirect, takeFrom } from '~utils/saga/effects';

import { uploadIfpsAnnotation } from '../utils';
import {
  getHomeBridge,
  getRawTransactionData,
  getTransferNFTData,
  getTransferFundsData,
  getContractInteractionData,
  getZodiacModule,
  onLocalDevEnvironment,
} from '../utils/safeHelpers';

function* initiateSafeTransactionMotion({
  payload: {
    safe,
    transactions,
    transactionsTitle: title,
    colonyAddress,
    colonyName,
    annotationMessage,
    motionDomainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION>) {
  let txChannel;
  try {
    txChannel = yield call(getTxChannel, metaId);
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager: ColonyManager = yield getColonyManager();
    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    const ZODIAC_BRIDGE_MODULE_ADDRESS = onLocalDevEnvironment
      ? process.env.ZODIAC_BRIDGE_MODULE_ADDRESS
      : safe.moduleContractAddress;

    if (!ZODIAC_BRIDGE_MODULE_ADDRESS) {
      throw new Error(
        `Please provide a ZODIAC_BRIDGE_MODULE_ADDRESS. If running local, please add key-pair to your .env file.`,
      );
    }
    const homeBridge = getHomeBridge(safe);
    const zodiacBridgeModule = getZodiacModule(
      ZODIAC_BRIDGE_MODULE_ADDRESS,
      safe,
    );

    const motionChildSkillIndex = yield call(
      getChildIndex,
      colonyClient,
      motionDomainId,
      ROOT_DOMAIN_ID,
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

    // setup batch ids and channels
    const batchKey = 'createMotion';

    const {
      createMotion,
      annotateInitiateSafeTransactionMotion,
    } = yield createTransactionChannels(metaId, [
      'createMotion',
      'annotateInitiateSafeTransactionMotion',
    ]);

    const transactionData: string[] = [];
    /*
     * Calls HomeBridge for each Tx, with the Colony as the sender.
     * Loop necessary as yield cannot be called inside of an array iterator (like forEach).
     */
    /* eslint-disable-next-line no-restricted-syntax */
    for (const transaction of transactions) {
      let txDataToBeSentToZodiacModule = '';
      switch (transaction.transactionType) {
        case TransactionTypes.RAW_TRANSACTION:
          txDataToBeSentToZodiacModule = getRawTransactionData(
            zodiacBridgeModule,
            transaction,
          );
          break;
        case TransactionTypes.TRANSFER_NFT:
          txDataToBeSentToZodiacModule = getTransferNFTData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        case TransactionTypes.TRANSFER_FUNDS:
          txDataToBeSentToZodiacModule = yield getTransferFundsData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        case TransactionTypes.CONTRACT_INTERACTION:
          txDataToBeSentToZodiacModule = yield getContractInteractionData(
            zodiacBridgeModule,
            safe,
            transaction,
          );
          break;
        default:
          throw new Error(
            `Unknown transaction type: ${transaction.transactionType}`,
          );
      }

      /* eslint-disable-next-line max-len */
      const txDataToBeSentToAMB = yield homeBridge.interface.functions.requireToPassMessage.encode(
        [zodiacBridgeModule.address, txDataToBeSentToZodiacModule, 1000000],
      );

      transactionData.push(txDataToBeSentToAMB);
    }

    // eslint-disable-next-line max-len
    const encodedAction = colonyClient.interface.functions.makeArbitraryTransactions.encode(
      [
        /**
         * The first param of makeArbitraryTransactions is an array of addresses of the receivers. For 1 transactionData, there should be 1 address in the array.
         * All the transactions will be send to the home bridge, therefore we just generate an array filled with the corresponding address.
         *
         */
        fill(Array(transactionData.length), homeBridge.address),
        transactionData,
        true,
      ],
    );

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

    yield fork(createTransaction, annotateInitiateSafeTransactionMotion.id, {
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

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_CREATED);

    yield takeFrom(
      annotateInitiateSafeTransactionMotion.channel,
      ActionTypes.TRANSACTION_CREATED,
    );

    yield put(transactionReady(createMotion.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createMotion.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(createMotion.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Upload all data via annotationMessage to IPFS.
     * This is to avoid storing the data in the colony metadata.
     */
    const annotationMessageIpfsHash = yield call(uploadIfpsAnnotation, {
      title,
      transactions,
      safeData: {
        contractAddress: safe.contractAddress,
        chainId: safe.chainId,
      },
      annotationMessage,
    });

    yield put(transactionPending(annotateInitiateSafeTransactionMotion.id));

    yield put(
      transactionAddParams(annotateInitiateSafeTransactionMotion.id, [
        txHash,
        annotationMessageIpfsHash,
      ]),
    );

    yield put(transactionReady(annotateInitiateSafeTransactionMotion.id));

    yield takeFrom(
      annotateInitiateSafeTransactionMotion.channel,
      ActionTypes.TRANSACTION_SUCCEEDED,
    );

    /*
     * Update the colony object cache
     */
    yield apolloClient.query<ColonyFromNameQuery, ColonyFromNameQueryVariables>(
      {
        query: ColonyFromNameDocument,
        variables: { name: colonyName || '', address: colonyAddress },
        fetchPolicy: 'network-only',
      },
    );

    yield put<AllActions>({
      type: ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* createInitiateSafeTransactionSaga() {
  yield takeEvery(
    ActionTypes.MOTION_INITIATE_SAFE_TRANSACTION,
    initiateSafeTransactionMotion,
  );
}
