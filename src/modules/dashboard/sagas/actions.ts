import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { bigNumberify } from 'ethers/utils';
import moveDecimal from 'move-decimal-point';
import {
  ClientType,
  ColonyClient,
  ROOT_DOMAIN_ID,
  ColonyVersion,
} from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
  ColonyFromNameDocument,
  ColonyFromNameQuery,
  ColonyFromNameQueryVariables,
  SubgraphActionsQuery,
  SubgraphActionsQueryVariables,
  SubgraphActionsDocument,
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  SubgraphColonyMetadataQuery,
  SubgraphColonyMetadataQueryVariables,
  SubgraphColonyMetadataDocument,
  getNetworkContracts,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import { COLONY_TOTAL_BALANCE_DOMAIN_ID } from '~constants';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import {
  transactionReady,
  transactionAddParams,
} from '../../core/actionCreators';
import { updateColonyDisplayCache } from './utils';

function* createPaymentAction({
  payload: {
    colonyAddress,
    colonyName,
    recipientAddress,
    domainId,
    singlePayment,
    annotationMessage,
  },
  meta: {
    id: metaId,
    /*
     * @NOTE About the react router history object
     *
     * Apparently this is considered a best practice when needing to change
     * the route from inside a redux saga, to pass in the history object from
     * the component itself.
     *
     * See:
     * https://reactrouter.com/web/guides/deep-redux-integration
     */
    history,
  },
  meta,
}: Action<ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the payment
     */
    if (!recipientAddress) {
      throw new Error('Recipient not assigned for OneTxPayment transaction');
    }
    if (!domainId) {
      throw new Error('Domain not set for OneTxPayment transaction');
    }
    if (!singlePayment) {
      throw new Error('Payment details not set for OneTxPayment transaction');
    } else {
      if (!singlePayment.amount) {
        throw new Error('Payment amount not set for OneTxPayment transaction');
      }
      if (!singlePayment.tokenAddress) {
        throw new Error('Payment token not set for OneTxPayment transaction');
      }
      if (!singlePayment.decimals) {
        throw new Error(
          'Payment token decimals not set for OneTxPayment transaction',
        );
      }
    }

    const { amount, tokenAddress, decimals = 18 } = singlePayment;

    let ipfsHash = null;
    if (annotationMessage) {
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    /*
     * setup batch ids and channels
     */
    const batchKey = 'paymentAction';

    const {
      paymentAction,
      annotatePaymentAction,
    } = yield createTransactionChannels(metaId, [
      'paymentAction',
      'annotatePaymentAction',
    ]);

    yield fork(createTransaction, paymentAction.id, {
      context: ClientType.OneTxPaymentClient,
      methodName: 'makePaymentFundedFromDomainWithProofs',
      identifier: colonyAddress,
      params: [
        [recipientAddress],
        [tokenAddress],
        [bigNumberify(moveDecimal(amount, decimals))],
        domainId,
        /*
         * NOTE Always make the payment in the global skill 0
         * This will make it so that the user only receives reputation in the
         * above domain, but none in the skill itself.
         */
        0,
      ],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotatePaymentAction.id, {
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

    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotatePaymentAction.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(paymentAction.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      paymentAction.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(paymentAction.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(
        transactionAddParams(annotatePaymentAction.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotatePaymentAction.id));

      yield takeFrom(
        annotatePaymentAction.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    // Refetch token balances for the domains involved
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [tokenAddress],
        /*
         * @NOTE Also update the value in "All Domains"
         */
        domainIds: [COLONY_TOTAL_BALANCE_DOMAIN_ID, domainId],
      },
      // Force resolvers to update, as query resolvers are only updated on a cache miss
      // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
      // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      SubgraphActionsQuery,
      SubgraphActionsQueryVariables
    >({
      query: SubgraphActionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLocaleLowerCase(),
        skip: 0,
        first: 1,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    putError(ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT_ERROR, error, meta);
  } finally {
    txChannel.close();
  }
}

function* createMoveFundsAction({
  payload: {
    colonyAddress,
    colonyName,
    fromDomainId,
    toDomainId,
    amount,
    tokenAddress,
    annotationMessage,
  },
  meta: {
    id: metaId,
    /*
     * @NOTE About the react router history object
     *
     * Apparently this is considered a best practice when needing to change
     * the route from inside a redux saga, to pass in the history object from
     * the component itself.
     *
     * See:
     * https://reactrouter.com/web/guides/deep-redux-integration
     */
    history,
  },
  meta,
}: Action<ActionTypes.COLONY_ACTION_MOVE_FUNDS>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );

    /*
     * Validate the required values for the payment
     */
    if (!fromDomainId) {
      throw new Error(
        'Source domain not set for oveFundsBetweenPots transaction',
      );
    }
    if (!toDomainId) {
      throw new Error(
        'Recipient domain not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!amount) {
      throw new Error(
        'Payment amount not set for MoveFundsBetweenPots transaction',
      );
    }
    if (!tokenAddress) {
      throw new Error(
        'Payment token not set for MoveFundsBetweenPots transaction',
      );
    }

    const [{ fundingPotId: fromPot }, { fundingPotId: toPot }] = yield all([
      call([colonyClient, colonyClient.getDomain], fromDomainId),
      call([colonyClient, colonyClient.getDomain], toDomainId),
    ]);

    let ipfsHash = null;
    if (annotationMessage) {
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'moveFunds';

    const {
      moveFunds,
      annotateMoveFunds,
    } = yield createTransactionChannels(metaId, [
      'moveFunds',
      'annotateMoveFunds',
    ]);

    yield fork(createTransaction, moveFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'moveFundsBetweenPotsWithProofs',
      identifier: colonyAddress,
      params: [fromPot, toPot, amount, tokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMoveFunds.id, {
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

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(moveFunds.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      moveFunds.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );

    yield takeFrom(moveFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionAddParams(annotateMoveFunds.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateMoveFunds.id));

      yield takeFrom(
        annotateMoveFunds.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    // Refetch token balances for the domains involved
    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [tokenAddress],
        domainIds: [fromDomainId, toDomainId],
      },
      // Force resolvers to update, as query resolvers are only updated on a cache miss
      // See #4: https://www.apollographql.com/docs/link/links/state/#resolvers
      // Also: https://www.apollographql.com/docs/react/api/react-apollo/#optionsfetchpolicy
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      SubgraphActionsQuery,
      SubgraphActionsQueryVariables
    >({
      query: SubgraphActionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLocaleLowerCase(),
        skip: 0,
        first: 1,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_MOVE_FUNDS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.COLONY_ACTION_MOVE_FUNDS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

function* createMintTokensAction({
  payload: {
    colonyAddress,
    colonyName,
    nativeTokenAddress,
    amount,
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_MINT_TOKENS>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }

    let ipfsHash = null;
    if (annotationMessage) {
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    // setup batch ids and channels
    const batchKey = 'mintTokens';

    const {
      mintTokens,
      claimColonyFunds,
      annotateMintTokens,
    } = yield createTransactionChannels(metaId, [
      'mintTokens',
      'claimColonyFunds',
      'annotateMintTokens',
    ]);

    // create transactions
    yield fork(createTransaction, mintTokens.id, {
      context: ClientType.ColonyClient,
      methodName: 'mintTokens',
      identifier: colonyAddress,
      params: [amount],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });
    yield fork(createTransaction, claimColonyFunds.id, {
      context: ClientType.ColonyClient,
      methodName: 'claimColonyFunds',
      identifier: colonyAddress,
      params: [nativeTokenAddress],
      group: {
        key: batchKey,
        id: metaId,
        index: 1,
      },
      ready: false,
    });

    if (annotationMessage) {
      yield fork(createTransaction, annotateMintTokens.id, {
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

    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_CREATED);
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateMintTokens.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(mintTokens.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      mintTokens.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(mintTokens.channel, ActionTypes.TRANSACTION_SUCCEEDED);
    yield put(transactionReady(claimColonyFunds.id));
    yield takeFrom(claimColonyFunds.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(
        transactionAddParams(annotateMintTokens.id, [txHash, ipfsHash]),
      );

      yield put(transactionReady(annotateMintTokens.id));

      yield takeFrom(
        annotateMintTokens.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

    yield apolloClient.query<
      TokenBalancesForDomainsQuery,
      TokenBalancesForDomainsQueryVariables
    >({
      query: TokenBalancesForDomainsDocument,
      variables: {
        colonyAddress,
        tokenAddresses: [nativeTokenAddress],
      },
      fetchPolicy: 'network-only',
    });

    yield apolloClient.query<
      SubgraphActionsQuery,
      SubgraphActionsQueryVariables
    >({
      query: SubgraphActionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLocaleLowerCase(),
        skip: 0,
        first: 1,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_MINT_TOKENS_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(ActionTypes.COLONY_ACTION_MINT_TOKENS_ERROR, caughtError, meta);
  } finally {
    txChannel.close();
  }
}

function* createVersionUpgradeAction({
  payload: { colonyAddress, colonyName, version, annotationMessage },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_VERSION_UPGRADE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

    const { version: newestVersion } = yield getNetworkContracts();
    const currentVersion = parseInt(version, 10);
    const nextVersion = currentVersion + 1;
    if (nextVersion > parseInt(newestVersion, 10)) {
      throw new Error('Colony has the newest version');
    }

    const supportAnnotation =
      currentVersion >= ColonyVersion.CeruleanLightweightSpaceship &&
      annotationMessage;

    let ipfsHash = null;
    if (supportAnnotation) {
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'upgrade';

    const { upgrade, annotateUpgrade } = yield createTransactionChannels(
      metaId,
      ['upgrade', 'annotateUpgrade'],
    );

    yield fork(createTransaction, upgrade.id, {
      context: ClientType.ColonyClient,
      methodName: 'upgrade',
      identifier: colonyAddress,
      params: [nextVersion],
      group: {
        key: batchKey,
        id: metaId,
        index: 0,
      },
      ready: false,
    });

    if (supportAnnotation) {
      yield fork(createTransaction, annotateUpgrade.id, {
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

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_CREATED);

    if (supportAnnotation) {
      yield takeFrom(annotateUpgrade.channel, ActionTypes.TRANSACTION_CREATED);
    }

    yield put(transactionReady(upgrade.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_HASH_RECEIVED);

    yield takeFrom(upgrade.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (supportAnnotation) {
      yield put(transactionAddParams(annotateUpgrade.id, [txHash, ipfsHash]));

      yield put(transactionReady(annotateUpgrade.id));

      yield takeFrom(
        annotateUpgrade.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

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

    yield colonyManager.setColonyClient(colonyAddress);

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_VERSION_UPGRADE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (caughtError) {
    putError(
      ActionTypes.COLONY_ACTION_VERSION_UPGRADE_ERROR,
      caughtError,
      meta,
    );
  } finally {
    txChannel.close();
  }
}

function* createDomainAction({
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
}: Action<ActionTypes.COLONY_ACTION_DOMAIN_CREATE>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);
    /*
     * Validate the required values for the payment
     */
    if (!domainName) {
      throw new Error('A domain name is required to create a new domain');
    }

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

    /*
     * Upload domain metadata to IPFS
     */
    let annotationMessageIpfsHash = null;
    if (annotationMessage) {
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'createDomainAction';
    const {
      createDomainAction: createDomain,
      annotateCreateDomainAction: annotateCreateDomain,
    } = yield createTransactionChannels(metaId, [
      'createDomainAction',
      'annotateCreateDomainAction',
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

    yield createGroupTransaction(createDomain, {
      context: ClientType.ColonyClient,
      methodName: 'addDomainWithProofs',
      identifier: colonyAddress,
      params: [parentId, domainMetadataIpfsHash],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateCreateDomain, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateCreateDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(createDomain.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(
        transactionAddParams(annotateCreateDomain.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateCreateDomain.id));

      yield takeFrom(
        annotateCreateDomain.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

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

    yield apolloClient.query<
      SubgraphActionsQuery,
      SubgraphActionsQueryVariables
    >({
      query: SubgraphActionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLocaleLowerCase(),
        skip: 0,
        first: 1,
      },
      fetchPolicy: 'network-only',
    });

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_DOMAIN_CREATE_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_DOMAIN_CREATE_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* editColonyAction({
  payload: {
    colonyAddress,
    colonyName,
    colonyDisplayName,
    colonyAvatarImage,
    colonyTokens = [],
    annotationMessage,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_EDIT_COLONY>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    /*
     * Validate the required values for the payment
     */
    if (!colonyDisplayName && colonyDisplayName !== null) {
      throw new Error('A colony name is required in order to edit the colony');
    }

    /*
     * Upload colony metadata to IPFS
     */
    let colonyAvatarIpfsHash = null;
    if (colonyAvatarImage) {
      colonyAvatarIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify(colonyAvatarImage),
      );
    }

    /*
     * Upload colony metadata to IPFS
     */
    let colonyMetadataIpfsHash = null;
    colonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        colonyName,
        colonyDisplayName,
        colonyAvatarHash: colonyAvatarImage ? colonyAvatarIpfsHash : null,
        colonyTokens,
      }),
    );

    /*
     * Upload annotation metadata to IPFS
     */
    let annotationMessageIpfsHash = null;
    if (annotationMessage) {
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editColonyAction';
    const {
      editColonyAction: editColony,
      annotateEditColonyAction: annotateEditColony,
    } = yield createTransactionChannels(metaId, [
      'editColonyAction',
      'annotateEditColonyAction',
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

    yield createGroupTransaction(editColony, {
      context: ClientType.ColonyClient,
      methodName: 'editColony',
      identifier: colonyAddress,
      params: [colonyMetadataIpfsHash],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditColony, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionReady(editColony.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(
        transactionAddParams(annotateEditColony.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateEditColony.id));

      yield takeFrom(
        annotateEditColony.channel,
        ActionTypes.TRANSACTION_SUCCEEDED,
      );
    }

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

    yield apolloClient.query<
      SubgraphActionsQuery,
      SubgraphActionsQueryVariables
    >({
      query: SubgraphActionsDocument,
      variables: {
        colonyAddress: colonyAddress.toLocaleLowerCase(),
        first: 1,
        skip: 0,
      },
      fetchPolicy: 'network-only',
    });

    /*
     * Re-fetch colony metadata history so we have the new values to compare agaist
     * This could have also been a cache update since we have all ifps hashes locally
     */
    yield apolloClient.query<
      SubgraphColonyMetadataQuery,
      SubgraphColonyMetadataQueryVariables
    >({
      query: SubgraphColonyMetadataDocument,
      variables: {
        address: colonyAddress.toLocaleLowerCase(),
      },
      fetchPolicy: 'network-only',
    });

    /*
     * Update apollo's cache for the current colony to reflect the recently
     * made changes
     */
    yield updateColonyDisplayCache(
      colonyAddress,
      colonyDisplayName,
      colonyAvatarIpfsHash,
      colonyAvatarImage as string | null,
    );

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_EDIT_COLONY_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_EDIT_COLONY_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* tasksSagas() {
  yield takeEvery(
    ActionTypes.COLONY_ACTION_EXPENDITURE_PAYMENT,
    createPaymentAction,
  );
  yield takeEvery(ActionTypes.COLONY_ACTION_MOVE_FUNDS, createMoveFundsAction);
  yield takeEvery(
    ActionTypes.COLONY_ACTION_MINT_TOKENS,
    createMintTokensAction,
  );
  yield takeEvery(ActionTypes.COLONY_ACTION_DOMAIN_CREATE, createDomainAction);
  yield takeEvery(
    ActionTypes.COLONY_ACTION_VERSION_UPGRADE,
    createVersionUpgradeAction,
  );
  yield takeEvery(ActionTypes.COLONY_ACTION_EDIT_COLONY, editColonyAction);
}
