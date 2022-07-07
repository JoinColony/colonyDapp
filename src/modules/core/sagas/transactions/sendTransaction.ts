import { call, put, take } from 'redux-saga/effects';
import { Contract, Signer, providers } from 'ethers';
import { TransactionResponse, Web3Provider } from 'ethers/providers';
import { BigNumberish, splitSignature } from 'ethers/utils';
import { soliditySha3 } from 'web3-utils';
import {
  ContractClient,
  TransactionOverrides,
  Network,
  ClientType,
} from '@colony/colony-js';
import abis from '@colony/colony-js/lib-esm/abis';
import { hexSequenceNormalizer } from '@purser/core';
import { HttpProvider } from 'web3-providers';

import { ActionTypes } from '~redux/index';
import { selectAsJS } from '~utils/saga/effects';
import { mergePayload } from '~utils/actions';
import { generateMetatransactionErrorMessage } from '~utils/web3';
import {
  TRANSACTION_STATUSES,
  TRANSACTION_METHODS,
  TransactionRecord,
} from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action } from '~redux/types/actions';
import { ExtendedClientType, MethodParams } from '~types/index';
import { DEFAULT_NETWORK } from '~constants';

import { transactionSendError } from '../../actionCreators';
import { oneTransaction } from '../../selectors';

import transactionChannel from './transactionChannel';

/*
 * Given a method and a transaction record, create a promise for sending the
 * transaction with the method.
 */
async function getTransactionMethodPromise(
  // @TODO this is not great but I feel like we will replace this anyways at some point
  client: ContractClient,
  tx: TransactionRecord,
): Promise<TransactionResponse> {
  const {
    methodName,
    options: {
      gasLimit: gasLimitOverride,
      gasPrice: gasPriceOverride,
      ...restOptions
    },
    params,
    gasLimit,
    gasPrice,
  } = tx;
  const sendOptions: TransactionOverrides = {
    gasLimit: gasLimitOverride || gasLimit,
    gasPrice: gasPriceOverride || gasPrice,
    ...restOptions,
  };
  return client[methodName](...[...params, sendOptions]);
}

async function getMetatransactionMethodPromise(
  client: ContractClient,
  { methodName, params, identifier: colonyAddress, id }: TransactionRecord,
): Promise<TransactionResponse> {
  const wallet = TEMP_getContext(ContextModule.Wallet);
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
  const { networkClient } = colonyManager;
  const { address: userAddress } = wallet;

  let normalizedMethodName: string = methodName;
  let normalizedClient: ContractClient = client;
  let lightTokenClient: ContractClient = client;
  let normalizedParams: MethodParams = params;

  switch (methodName) {
    /*
     * For metatransactions we have to use the DeployTokenViaNetwork method
     */
    case TRANSACTION_METHODS.DeployToken:
      normalizedMethodName = TRANSACTION_METHODS.DeployTokenViaNetwork;
      break;
    /*
     * DeployTokenAuthority is not available on the contracts in normal circumstances (we add it via colonyJS)
     * But with metatransactions, it exits, but on a different client, with different params
     * So we have to do this ugly switch-aroo just to make the different api happy :(
     */
    case TRANSACTION_METHODS.DeployTokenAuthority: {
      normalizedClient = networkClient;
      const [tokenAddress, allowedToTransfer] = params;
      normalizedParams = [
        tokenAddress,
        colonyAddress as string,
        allowedToTransfer,
      ];
      break;
    }
    default:
      break;
  }

  /*
   * @NOTE If it's a TokenClient we need to reinstantiate as the "light" token client
   * basically a frankenstein's monster (currently) supporting both Metatransactions
   * and EIP-2612 (or attempting to anyway)
   */
  if (client.clientType === ClientType.TokenClient) {
    // eslint-disable-next-line no-console
    console.log(`We're using a Token Client`);

    lightTokenClient = new Contract(
      // NOTE: This is actually the token's address
      colonyAddress || '',
      [
        'function getMetatransactionNonce(address) view returns (uint256)',
        'function nonces(address) view returns (uint256)',
      ],
      colonyManager.signer,
    );
    lightTokenClient.clientType = ClientType.TokenClient;
    lightTokenClient.tokenClientType = ExtendedClientType.LightTokenClient;
    lightTokenClient.metatransactionVariation = 'metatransactions';
  }

  const { provider } = normalizedClient;

  let availableNonce: BigNumberish | undefined;

  /*
   * @NOTE We have two ways to go about Metatransactions when it comes to the Token Client
   * Either vanilla metransactions or Signed Approvals. We need to check for both,
   * and attempt to use of them
   */
  if (normalizedClient.clientType === ClientType.TokenClient) {
    /*
     * See if the token supports Metatransactions
     */
    try {
      availableNonce = await lightTokenClient.getMetatransactionNonce(
        userAddress,
      );
      lightTokenClient.metatransactionVariation = 'metatransactions';
    } catch (error) {
      // silent error
    }
    /*
     * Otherwise, see if supports EIP-2612
     * https://eips.ethereum.org/EIPS/eip-2612
     */
    try {
      availableNonce = await lightTokenClient.nonces(userAddress);
      lightTokenClient.metatransactionVariation = 'eip2612';
    } catch (error) {
      // silent error
    }
    /*
     * @TODO REMOVE!!
     */
    lightTokenClient.metatransactionVariation = 'eip2612';
    // eslint-disable-next-line no-console
    console.log(
      `Token Client is using the ${lightTokenClient.metatransactionVariation} variation`,
    );

    if (!availableNonce) {
      throw new Error(generateMetatransactionErrorMessage(lightTokenClient));
    }
  } else {
    /*
     * If the client we're going to query doesn't have such a call it means that
     * most likely it doesn't support metatransactions.
     * This can be either our contracts (older ones) or external contracts without
     * support
     */
    try {
      availableNonce = await normalizedClient.getMetatransactionNonce(
        userAddress,
      );
    } catch (error) {
      throw new Error(generateMetatransactionErrorMessage(normalizedClient));
    }
  }

  // eslint-disable-next-line no-console
  console.log('Current NONCE', availableNonce);

  // eslint-disable-next-line no-console
  console.log(
    'Transaction to send',
    normalizedClient.clientType,
    normalizedMethodName,
    params,
  );

  // eslint-disable-next-line no-console
  console.log('NORMALIZED CLIENT', normalizedClient);
  if (normalizedClient.clientType === ClientType.TokenClient) {
    // eslint-disable-next-line no-console
    console.log('LIGHT TOKEN CLIENT', lightTokenClient);
  }

  const { chainId: currentNetworkChainId } = await provider.getNetwork();
  let chainId = currentNetworkChainId;
  if (DEFAULT_NETWORK === Network.Local) {
    /*
     * Due to ganache internals shannanigans, when on the local ganache network
     * we must use chainId 1, otherwise the broadcaster (and the underlying contracts)
     * wont't be able to verify the signature (due to a chainId miss-match)
     *
     * This issue is only valid for ganache networks, as in production the chain id
     * is returned properly
     */
    chainId = 1;
  }

  let broadcastData = '';
  if (
    normalizedClient.clientType === ClientType.TokenClient &&
    lightTokenClient.metatransactionVariation === 'eip2612'
  ) {
    // eslint-disable-next-line no-console
    console.log(
      `Broadcasting transaction as EIP2612 Metadata variation (obviously via a Token Client)`,
    );

    const tokenName = await normalizedClient.name();
    const [tokenLockingContractAddres, amount] = params;

    let spender: string | undefined = '';
    switch (methodName) {
      case TRANSACTION_METHODS.Approve: {
        spender = tokenLockingContractAddres as string;
        break;
      }
      default:
        break;
    }

    const deadline = Math.floor(Date.now() / 1000) + 3600;
    const signatureApproval = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Permit: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
      },
      primaryType: 'Permit',
      domain: {
        name: tokenName,
        version: 1,
        chainId,
        verifyingContract: normalizedClient.address,
      },
      message: {
        owner: userAddress,
        spender,
        value: amount.toString(),
        nonce: availableNonce?.toString(),
        /*
         * @NOTE One hour in the future from now
         * Time is in seconds
         */
        deadline,
      },
    };

    // eslint-disable-next-line no-console
    console.log('Typed Approval', signatureApproval);

    const eip2612signature = await provider.send('eth_signTypedData', [
      userAddress,
      signatureApproval,
    ]);

    // eslint-disable-next-line no-console
    console.log('SIGNATURE for Typed Approval', eip2612signature);

    // const { r, s, v } = splitSignature(eip2612signature);

    const r = `0x${eip2612signature.substring(2, 66)}`;
    const s = `0x${eip2612signature.substring(66, 130)}`;
    const v = parseInt(eip2612signature.substring(130), 16);

    broadcastData = JSON.stringify({
      target: normalizedClient.address,
      owner: userAddress,
      spender,
      value: amount.toString(),
      deadline,
      r,
      s,
      v,
    });

    // eslint-disable-next-line no-console
    console.log('Broadcast data', broadcastData);

  } else {
    // eslint-disable-next-line no-console
    console.log('Broadcasting transaction as VANILLA Metadata variation');
    /*
     * All the 'WithProofs' helpers don't really exist on chain, so we have to
     * make sure we are calling the on-chain method, rather than our own helper
     */
    const encodedTransaction = await normalizedClient.interface.functions[
      normalizedMethodName
    ].encode([...normalizedParams]);

    // eslint-disable-next-line no-console
    console.log('Encoded transaction', encodedTransaction);

    const message = soliditySha3(
      { t: 'uint256', v: availableNonce?.toString() as string },
      { t: 'address', v: normalizedClient.address },
      { t: 'uint256', v: chainId },
      { t: 'bytes', v: encodedTransaction },
    ) as string;

    // eslint-disable-next-line no-console
    console.log('Transaction message', message);

    const messageBuffer = Buffer.from(
      hexSequenceNormalizer(message, false),
      'hex',
    );

    const convertedBufferMessage = Array.from(messageBuffer);
    /*
     * Purser validator expects either a string or a Uint8Array. We convert this
     * to a an array to make Metamask happy when signing the buffer.
     *
     * So in order to actually pass validation, both for Software and Metamask
     * wallets we need to "fake" the array as actually being a Uint.
     *
     * Note this not affect the format of the data passed in to be signed,
     * or the signature.
     */
    convertedBufferMessage.constructor = Uint8Array;

    // eslint-disable-next-line no-console
    console.log('Actual signature converted Buffer', convertedBufferMessage);

    const metatransactionSignature = await wallet.signMessage({
      messageData: (convertedBufferMessage as unknown) as Uint8Array,
    });

    // eslint-disable-next-line no-console
    console.log('Signature', metatransactionSignature);

    const { r, s, v } = splitSignature(metatransactionSignature);

    broadcastData = JSON.stringify({
      target: normalizedClient.address,
      payload: encodedTransaction,
      userAddress,
      r,
      s,
      v,
    });

    // eslint-disable-next-line no-console
    console.log('Broadcast data', broadcastData);
  }

  const response = await fetch(
    `${process.env.BROADCASTER_ENDPOINT}/broadcast`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: broadcastData,
    },
  );
  const {
    message: responseErrorMessage,
    status: reponseStatus,
    data: responseData,
  } = await response.json();

  // eslint-disable-next-line no-console
  console.log(
    'Response data',
    responseErrorMessage,
    reponseStatus,
    responseData,
  );

  if (reponseStatus !== 'success') {
    throw new Error(
      responseErrorMessage?.reason ||
        responseErrorMessage ||
        responseData?.payload,
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Metatransaction ${id} done ------------`);

  return {
    hash: responseData.txHash,
  } as TransactionResponse;
}

export default function* sendTransaction({
  meta: { id },
}: Action<ActionTypes.TRANSACTION_SEND>) {
  const transaction: TransactionRecord = yield selectAsJS(oneTransaction, id);

  const {
    status,
    context,
    identifier,
    metatransaction,
    methodName,
  } = transaction;

  if (status !== TRANSACTION_STATUSES.READY) {
    throw new Error('Transaction is not ready to send.');
  }
  const colonyManager = TEMP_getContext(ContextModule.ColonyManager);

  let contextClient: ContractClient;
  if (context === ClientType.TokenClient) {
    contextClient = yield colonyManager.getTokenClient(identifier as string);
  } else if (context === ClientType.TokenLockingClient) {
    contextClient = yield colonyManager.getTokenLockingClient(
      identifier as string,
    );
  } else if (
    metatransaction &&
    methodName === TRANSACTION_METHODS.DeployTokenAuthority
  ) {
    contextClient = colonyManager.networkClient;
  } else if (context === ExtendedClientType.WrappedTokenClient) {
    // @ts-ignore
    const wrappedTokenAbi = abis.WrappedToken.default.abi;
    contextClient = new Contract(
      identifier || '',
      wrappedTokenAbi,
      colonyManager.signer,
    );
    contextClient.clientType = ExtendedClientType.WrappedTokenClient;
  } else if (context === ExtendedClientType.VestingSimpleClient) {
    // @ts-ignore
    const vestingSimpleAbi = abis.vestingSimple.default.abi;
    contextClient = new Contract(
      identifier || '',
      vestingSimpleAbi,
      colonyManager.signer,
    );
    contextClient.clientType = ExtendedClientType.VestingSimpleClient;
  } else {
    contextClient = yield colonyManager.getClient(
      context as ClientType,
      identifier,
    );
  }

  if (!contextClient) {
    throw new Error('Context client failed to instantiate');
  }

  const promiseMethod = metatransaction
    ? getMetatransactionMethodPromise
    : getTransactionMethodPromise;

  /*
   * @NOTE Create a promise to send the transaction with the given method.
   *
   * DO NOT! yield this method! Otherwise the error we're throwing inside
   * `getMetatransactionMethodPromise` based on the broadcaster's response message
   * will not catch, so the UI will not properly display it in the Gas Station
   */
  const txPromise = promiseMethod(contextClient, transaction);

  const channel = yield call(
    transactionChannel,
    txPromise,
    transaction,
    contextClient,
  );

  try {
    while (true) {
      const action = yield take(channel);
      // Add the transaction to the payload (we need to get the most recent version of it)
      const currentTransaction = yield selectAsJS(oneTransaction, id);

      // Put the action to the store
      yield put(mergePayload({ transaction: currentTransaction })(action));
    }
  } catch (error) {
    console.error(error);
    yield put(transactionSendError(id, error));
  } finally {
    channel.close();
  }
}
