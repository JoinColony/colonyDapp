import { call, fork, put, takeEvery } from 'redux-saga/effects';
import { ClientType, getPermissionProofs, ColonyRole, ROOT_DOMAIN_ID } from '@colony/colony-js';

import { ContextModule, TEMP_getContext } from '~context/index';
import {
  TokenBalancesForDomainsDocument,
  TokenBalancesForDomainsQuery,
  TokenBalancesForDomainsQueryVariables,
} from '~data/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError, takeFrom, routeRedirect } from '~utils/saga/effects';

import { uploadIfpsAnnotation } from '../utils';
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
import { soliditySha3, toChecksumAddress } from 'web3-utils';
import Web3 from 'web3';
import { getAccounts } from '~users/ConnectWalletWizard/StepGanache';
import axios from 'axios';


export async function getMetaTransactionParameters(txData, key, targetAddress) {
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  console.log(provider)
  const web3 = new Web3(provider);
  const chainId = await web3.eth.getChainId();
  console.log(chainId);
  // Sign data
  const msg = soliditySha3(
    { t: "uint256", v: '0' },
    { t: "address", v: targetAddress },
    { t: "uint256", v: chainId },
    { t: "bytes", v: txData }
  );

  const {v, r, s} = await web3.eth.accounts.sign(msg, key);

  return { r, s, v };
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
    const context = TEMP_getContext(ContextModule.ColonyManager);
    const colonyClient = yield context.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }

    txChannel = yield call(getTxChannel, metaId);

    const votingReputationClient = yield context.getClient(
      ClientType.VotingReputationClient,
      colonyAddress,
    );

    const [permissionDomainId, childSkillIndex] = yield call(
      getPermissionProofs,
      colonyClient,
      ROOT_DOMAIN_ID,
      ColonyRole.Architecture,
      votingReputationClient.address,
    );

    const txData = colonyClient.interface.functions.addDomain.encode([
      permissionDomainId, childSkillIndex, ROOT_DOMAIN_ID]);

    const ganacheAccounts = getAccounts();
    const key = ganacheAccounts[0].value;
    const u = ganacheAccounts[0].label;
    console.log(u);
    const { r, s, v } = yield getMetaTransactionParameters(txData, key, colonyClient.address);
    console.log(r, s, v, txData);

    const jsonData = {
      target: colonyClient.address,
      payload: txData,
      userAddress: u,
      r,
      s,
      v,
    };

    const res = yield axios.post("http://127.0.0.1:3004/broadcast", jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    debugger;
    console.log(res);
  
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
          index: 2,
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

      const ipfsHash = yield call(uploadIfpsAnnotation, annotationMessage);

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

export default function* mintTokensActionSaga() {
  yield takeEvery(
    ActionTypes.COLONY_ACTION_MINT_TOKENS,
    createMintTokensAction,
  );
}
