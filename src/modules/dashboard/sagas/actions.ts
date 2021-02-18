import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { hexlify, hexZeroPad } from 'ethers/utils';
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
  ProcessedColonyQuery,
  ProcessedColonyQueryVariables,
  ProcessedColonyDocument,
  getNetworkContracts,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';
import {
  createTransaction,
  createTransactionChannels,
  getTxChannel,
} from '../../core/sagas';
import { ipfsUpload } from '../../core/sagas/ipfs';
import {
  transactionReady,
  transactionPending,
  transactionAddParams,
} from '../../core/actionCreators';
import { updateColonyDisplayCache } from './utils';

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
      yield put(transactionPending(annotateMoveFunds.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

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
      yield put(transactionPending(annotateMintTokens.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

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
      yield put(transactionPending(annotateUpgrade.id));

      let ipfsHash = null;
      ipfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

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
      params: [],
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

    yield put(transactionPending(createDomain.id));

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

    yield put(
      transactionAddParams(createDomain.id, [
        parentId,
        (domainMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(createDomain.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      createDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(createDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateCreateDomain.id));

      /*
       * Upload domain metadata to IPFS
       */
      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

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

function* editDomainAction({
  payload: {
    colonyAddress,
    colonyName,
    domainName,
    domainColor,
    domainPurpose,
    annotationMessage,
    domainId,
  },
  meta: { id: metaId, history },
  meta,
}: Action<ActionTypes.COLONY_ACTION_DOMAIN_EDIT>) {
  let txChannel;
  try {
    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

    if (!domainId) {
      throw new Error('A domain id is required to edit domain');
    }

    txChannel = yield call(getTxChannel, metaId);

    const batchKey = 'editDomainAction';
    const {
      editDomainAction: editDomain,
      annotateEditDomainAction: annotateEditDomain,
    } = yield createTransactionChannels(metaId, [
      'editDomainAction',
      'annotateEditDomainAction',
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

    yield createGroupTransaction(editDomain, {
      context: ClientType.ColonyClient,
      methodName: 'editDomainWithProofs',
      identifier: colonyAddress,
      params: [],
      ready: false,
    });

    if (annotationMessage) {
      yield createGroupTransaction(annotateEditDomain, {
        context: ClientType.ColonyClient,
        methodName: 'annotateTransaction',
        identifier: colonyAddress,
        params: [],
        ready: false,
      });
    }

    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_CREATED);
    if (annotationMessage) {
      yield takeFrom(
        annotateEditDomain.channel,
        ActionTypes.TRANSACTION_CREATED,
      );
    }

    yield put(transactionPending(editDomain.id));

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

    yield put(
      transactionAddParams(editDomain.id, [
        domainId,
        (domainMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(editDomain.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editDomain.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editDomain.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateEditDomain.id));

      /*
       * Upload annotationMessage to IPFS
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

      yield put(
        transactionAddParams(annotateEditDomain.id, [
          txHash,
          annotationMessageIpfsHash,
        ]),
      );

      yield put(transactionReady(annotateEditDomain.id));

      yield takeFrom(
        annotateEditDomain.channel,
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

    yield put<AllActions>({
      type: ActionTypes.COLONY_ACTION_DOMAIN_EDIT_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_DOMAIN_EDIT_ERROR,
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
    colonyAvatarHash,
    hasAvatarChanged,
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
      params: [],
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

    yield put(transactionPending(editColony.id));

    /*
     * Upload colony metadata to IPFS
     *
     * @NOTE Only (re)upload the avatar if it has changed, otherwise just use
     * the old hash.
     * This cuts down on some transaction signing wait time, since IPFS uplaods
     * tend to be on the slower side :(
     */
    let colonyAvatarIpfsHash = null;
    if (colonyAvatarImage && hasAvatarChanged) {
      colonyAvatarIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          image: colonyAvatarImage,
        }),
      );
    }

    /*
     * Upload colony metadata to IPFS
     */
    let colonyMetadataIpfsHash = null;
    colonyMetadataIpfsHash = yield call(
      ipfsUpload,
      JSON.stringify({
        colonyDisplayName,
        colonyAvatarHash: hasAvatarChanged
          ? colonyAvatarIpfsHash
          : colonyAvatarHash,
        colonyTokens,
      }),
    );

    yield put(
      transactionAddParams(editColony.id, [
        (colonyMetadataIpfsHash as unknown) as string,
      ]),
    );

    yield put(transactionReady(editColony.id));

    const {
      payload: { hash: txHash },
    } = yield takeFrom(
      editColony.channel,
      ActionTypes.TRANSACTION_HASH_RECEIVED,
    );
    yield takeFrom(editColony.channel, ActionTypes.TRANSACTION_SUCCEEDED);

    if (annotationMessage) {
      yield put(transactionPending(annotateEditColony.id));

      /*
       * Upload annotation metadata to IPFS
       */
      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
      );

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

function* createSetUserRolesAction({
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
}: Action<ActionTypes.COLONY_ACTION_USER_ROLES_SET>) {
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

      let annotationMessageIpfsHash = null;
      annotationMessageIpfsHash = yield call(
        ipfsUpload,
        JSON.stringify({
          annotationMessage,
        }),
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
      type: ActionTypes.COLONY_ACTION_USER_ROLES_SET_SUCCESS,
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
      type: ActionTypes.COLONY_ACTION_USER_ROLES_SET_SUCCESS,
      meta,
    });

    if (colonyName) {
      yield routeRedirect(`/colony/${colonyName}/tx/${txHash}`, history);
    }
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_USER_ROLES_SET_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

function* colonyTokenUnlock({
  meta,
  payload: { colonyAddress },
}: Action<ActionTypes.COLONY_ACTION_UNLOCK_TOKEN>) {
  const txChannel = yield call(getTxChannel, meta.id);

  try {
    yield fork(createTransaction, meta.id, {
      context: ClientType.ColonyClient,
      methodName: 'unlockToken',
      identifier: colonyAddress,
    });

    yield takeFrom(txChannel, ActionTypes.TRANSACTION_SUCCEEDED);

    yield put({
      type: ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_SUCCESS,
      meta,
    });

    const apolloClient = TEMP_getContext(ContextModule.ApolloClient);

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
  } catch (error) {
    return yield putError(
      ActionTypes.COLONY_ACTION_UNLOCK_TOKEN_ERROR,
      error,
      meta,
    );
  } finally {
    txChannel.close();
  }
  return null;
}

export default function* tasksSagas() {
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
  yield takeEvery(ActionTypes.COLONY_ACTION_DOMAIN_EDIT, editDomainAction);
  yield takeEvery(
    ActionTypes.COLONY_ACTION_USER_ROLES_SET,
    createSetUserRolesAction,
  );
  yield takeEvery(ActionTypes.COLONY_ACTION_UNLOCK_TOKEN, colonyTokenUnlock);
}
