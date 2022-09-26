import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType } from '@colony/colony-js';

import { Action, ActionTypes } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  ProcessedColonyDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  RecoveryEventsForSessionQueryVariables,
  RecoveryEventsForSessionQuery,
  RecoveryEventsForSessionDocument,
  RecoveryRolesAndApprovalsForSessionQuery,
  RecoveryRolesAndApprovalsForSessionQueryVariables,
  RecoveryRolesAndApprovalsForSessionDocument,
  RecoverySystemMessagesForSessionQuery,
  RecoverySystemMessagesForSessionQueryVariables,
  RecoverySystemMessagesForSessionDocument,
  ActionsThatNeedAttentionQuery,
  ActionsThatNeedAttentionQueryVariables,
  ActionsThatNeedAttentionDocument,
  RecoveryRolesUsersQuery,
  RecoveryRolesUsersQueryVariables,
  RecoveryRolesUsersDocument,
} from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';

import { ipfsUploadAnnotation } from '../utils';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../../core/actionCreators';
import {
  createTransaction,
  getTxChannel,
  createTransactionChannels,
} from '../../../core/sagas';

function* enterRecoveryAction({
  payload: { colonyAddress, walletAddress, colonyName, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.ACTION_RECOVERY>) {
  let txChannel;

  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'recoveryAction';
    const {
      recoveryAction,
      annotateRecoveryAction,
    } = yield createTransactionChannels(metaId, [
      'recoveryAction',
      'annotateRecoveryAction',
    ]);

    yield fork(createTransaction, recoveryAction.id, {
      context: ClientType.ColonyClient,
      methodName: 'enterRecoveryMode',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateRecoveryAction.id, {
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

    yield takeFrom(recoveryAction.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateRecoveryAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(recoveryAction.id));

    const {
      payload: { hash: txHash, blockNumber },
    } = yield takeFrom(
      recoveryAction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(recoveryAction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateRecoveryAction.id));

      const ipfsHash = yield call(ipfsUploadAnnotation, annotationMessage);

      yield put(
        transactionAddParams(annotateRecoveryAction.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateRecoveryAction.id));

      yield takeFrom(
        annotateRecoveryAction.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    /*
     * Refesh the current colony data object
     */
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
    /*
     * Refesh the current colony data object
     */
    yield apolloClient.query<
      RecoveryRolesUsersQuery,
      RecoveryRolesUsersQueryVariables
    >({
      query: RecoveryRolesUsersDocument,
      variables: {
        colonyAddress,
        endBlockNumber: blockNumber,
      },
    });
    /*
     * Refresh recovery events
     */
    yield apolloClient.query<
      RecoveryEventsForSessionQuery,
      RecoveryEventsForSessionQueryVariables
    >({
      query: RecoveryEventsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Actions that need attention
     */
    yield apolloClient.query<
      ActionsThatNeedAttentionQuery,
      ActionsThatNeedAttentionQueryVariables
    >({
      query: ActionsThatNeedAttentionDocument,
      variables: {
        colonyAddress,
        walletAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.ACTION_RECOVERY_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(ActionTypes.ACTION_RECOVERY_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
  return null;
}

function* setStorageSlotValue({
  payload: {
    colonyAddress,
    walletAddress,
    startBlock,
    storageSlotLocation,
    storageSlotValue,
  },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.ACTION_RECOVERY_SET_SLOT>) {
  let txChannel;
  try {
    if (!storageSlotLocation) {
      throw new Error(
        'The storage slot location is required in order to update it',
      );
    }
    if (!storageSlotValue) {
      throw new Error(
        'The storage slot value is required in order to update it',
      );
    }

    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'setStorageSlot';
    const { setStorageSlot } = yield createTransactionChannels(metaId, [
      'setStorageSlot',
    ]);

    yield fork(createTransaction, setStorageSlot.id, {
      context: ClientType.ColonyClient,
      methodName: 'setStorageSlotRecovery',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      params: [storageSlotLocation, storageSlotValue],
      ready: false,
    });

    yield takeFrom(setStorageSlot.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(setStorageSlot.id));

    yield takeFrom(setStorageSlot.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Refresh recovery events
     */
    yield apolloClient.query<
      RecoveryEventsForSessionQuery,
      RecoveryEventsForSessionQueryVariables
    >({
      query: RecoveryEventsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Refresh user approvals
     */
    yield apolloClient.query<
      RecoveryRolesAndApprovalsForSessionQuery,
      RecoveryRolesAndApprovalsForSessionQueryVariables
    >({
      query: RecoveryRolesAndApprovalsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Refresh Actions that need attention
     */
    yield apolloClient.query<
      ActionsThatNeedAttentionQuery,
      ActionsThatNeedAttentionQueryVariables
    >({
      query: ActionsThatNeedAttentionDocument,
      variables: {
        colonyAddress,
        walletAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.ACTION_RECOVERY_SET_SLOT_SUCCESS,
      meta,
    });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_RECOVERY_SET_SLOT_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* approveExitRecovery({
  payload: { colonyAddress, walletAddress, startBlock, scrollToRef },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.ACTION_RECOVERY_APPROVE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'approveExit';
    const { approveExit } = yield createTransactionChannels(metaId, [
      'approveExit',
    ]);

    yield fork(createTransaction, approveExit.id, {
      context: ClientType.ColonyClient,
      methodName: 'approveExitRecovery',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      params: [],
      ready: false,
    });

    yield takeFrom(approveExit.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(approveExit.id));

    yield takeFrom(approveExit.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Refresh recovery events
     */
    yield apolloClient.query<
      RecoveryEventsForSessionQuery,
      RecoveryEventsForSessionQueryVariables
    >({
      query: RecoveryEventsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Refresh user approvals
     */
    yield apolloClient.query<
      RecoveryRolesAndApprovalsForSessionQuery,
      RecoveryRolesAndApprovalsForSessionQueryVariables
    >({
      query: RecoveryRolesAndApprovalsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Refresh system messages
     */
    yield apolloClient.query<
      RecoverySystemMessagesForSessionQuery,
      RecoverySystemMessagesForSessionQueryVariables
    >({
      query: RecoverySystemMessagesForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });
    /*
     * Refresh Actions that need attention
     */
    yield apolloClient.query<
      ActionsThatNeedAttentionQuery,
      ActionsThatNeedAttentionQueryVariables
    >({
      query: ActionsThatNeedAttentionDocument,
      variables: {
        colonyAddress,
        walletAddress,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.ACTION_RECOVERY_APPROVE_SUCCESS,
      meta,
    });

    /*
     * This is such a HACKY WAY to do this...
     *
     * We're scrolling to the bottom of the page because the `ActionButton`
     * internal logic is broken, and doesn't trigger `onSuccess` after the
     * correct action has been dispatch
     *
     * Instead it triggers it randomly which breaks *something* in React internal's
     * rendering logic so that it won't find the element to scroll to anymore
     *
     * But this way suprisingly works, as it will fire it at the end of the saga
     * where everything else is cleaned up.
     *
     * As long as we're aware of it, it's not really such a big deal
     */
    scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_RECOVERY_APPROVE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* exitRecoveryMode({
  payload: { colonyAddress, startBlock, scrollToRef },
  meta: { id: metaId },
  meta,
}: Action<ActionTypes.ACTION_RECOVERY_APPROVE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'exitRecovery';
    const { exitRecovery } = yield createTransactionChannels(metaId, [
      'exitRecovery',
    ]);

    yield fork(createTransaction, exitRecovery.id, {
      context: ClientType.ColonyClient,
      methodName: 'exitRecoveryMode',
      identifier: colonyAddress,
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      params: [],
      ready: false,
    });

    yield takeFrom(exitRecovery.channel, ActionTypes.TRANSACTION_CREATED);

    yield put(transactionReady(exitRecovery.id));

    yield takeFrom(exitRecovery.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    /*
     * Refresh recovery events
     */
    yield apolloClient.query<
      RecoveryEventsForSessionQuery,
      RecoveryEventsForSessionQueryVariables
    >({
      query: RecoveryEventsForSessionDocument,
      variables: {
        colonyAddress,
        blockNumber: startBlock,
      },
      fetchPolicy: 'network-only',
    });

    yield put({
      type: ActionTypes.ACTION_RECOVERY_APPROVE_SUCCESS,
      meta,
    });

    /*
     * This is such a HACKY WAY to do this...
     *
     * We're scrolling to the bottom of the page because the `ActionButton`
     * internal logic is broken, and doesn't trigger `onSuccess` after the
     * correct action has been dispatch
     *
     * Instead it triggers it randomly which breaks *something* in React internal's
     * rendering logic so that it won't find the element to scroll to anymore
     *
     * But this way suprisingly works, as it will fire it at the end of the saga
     * where everything else is cleaned up.
     *
     * As long as we're aware of it, it's not really such a big deal
     */
    scrollToRef?.current?.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    return yield putError(
      ActionTypes.ACTION_RECOVERY_APPROVE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* enterRecoveryActionSaga() {
  yield takeEvery(ActionTypes.ACTION_RECOVERY, enterRecoveryAction);
  yield takeEvery(ActionTypes.ACTION_RECOVERY_SET_SLOT, setStorageSlotValue);
  yield takeEvery(ActionTypes.ACTION_RECOVERY_APPROVE, approveExitRecovery);
  yield takeEvery(ActionTypes.ACTION_RECOVERY_EXIT, exitRecoveryMode);
}
