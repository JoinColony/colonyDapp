import { put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyClient, Network } from '@colony/colony-js';
import { soliditySha3 } from 'web3-utils';
import { splitSignature } from 'ethers/utils';
import { hexSequenceNormalizer } from '@purser/core';

import { getLoggedInUser } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';
import { DEFAULT_NETWORK } from '~constants';
import { signMessage } from '../../../../core/sagas/messages';

/*
 * @TODO This is not a real action saga... yet
 * It's just being used as an example to be able generate a basic metatransactions
 *
 * The rest of the content for this saga will be added by
 * https://github.com/JoinColony/colonyDapp/pull/2779 which will also add a bunch
 * of abstractions over some of this boilerplate code
 */
function* createMintTokensMetaAction({
  payload: { colonyAddress, amount },
  meta,
}: Action<ActionTypes.META_MINT_TOKENS>) {
  try {
    if (!amount) {
      throw new Error('Amount to mint not set for mintTokens transaction');
    }
    const { walletAddress: userAddress } = yield getLoggedInUser();

    const colonyManager = TEMP_getContext(ContextModule.ColonyManager);
    const { provider } = colonyManager;

    const colonyClient: ColonyClient = yield colonyManager.getClient(
      ClientType.ColonyClient,
      colonyAddress,
    );
    const currentNonce = yield colonyClient.getMetatransactionNonce(
      userAddress,
    );

    /*
     * Prettier is the stupidest thing ever
     */
    // eslint-disable-next-line max-len
    const encodedTransaction = colonyClient.interface.functions.mintTokens.encode(
      [amount],
    );

    const { chainId: currentNetworkChainId } = yield provider.getNetwork();
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

    const metatransactionMessage = soliditySha3(
      { t: 'uint256', v: currentNonce.toString() },
      { t: 'address', v: colonyClient.address },
      { t: 'uint256', v: chainId },
      { t: 'bytes', v: encodedTransaction },
    ) as string;

    // eslint-disable-next-line no-console
    console.log('Transaction message', metatransactionMessage);

    const metatransactionMessageBuffer = Buffer.from(
      // metatransactionMessage.replace('0x', ''),
      hexSequenceNormalizer(metatransactionMessage, false),
      'hex',
    );

    const convertedBufferMetatransactionMessage = Array.from(
      metatransactionMessageBuffer,
    );
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
    convertedBufferMetatransactionMessage.constructor = Uint8Array;

    // eslint-disable-next-line no-console
    console.log(
      'Actual signature converted Buffer',
      convertedBufferMetatransactionMessage,
    );

    const metatransactionSignature = yield signMessage(
      'metaMintTokens',
      convertedBufferMetatransactionMessage,
    );

    // eslint-disable-next-line no-console
    console.log('Signature', metatransactionSignature);

    const { r, s, v } = splitSignature(metatransactionSignature);

    const broadcastData = JSON.stringify({
      target: colonyClient.address,
      payload: encodedTransaction,
      userAddress,
      r,
      s,
      v,
    });

    // eslint-disable-next-line no-console
    console.log('Broadcast data', broadcastData);

    const response = yield fetch(
      `${process.env.BROADCASTER_ENDPOINT}/broadcast`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: broadcastData,
      },
    );
    const responseData = yield response.json();

    // eslint-disable-next-line no-console
    console.log('Response data', responseData);

    if (responseData.status !== 'success') {
      yield putError(
        ActionTypes.META_MINT_TOKENS_ERROR,
        new Error(responseData.message.reason),
        meta,
      );
      return;
    }

    yield put<AllActions>({
      type: ActionTypes.META_MINT_TOKENS_SUCCESS,
      meta,
    });
  } catch (caughtError) {
    putError(ActionTypes.META_MINT_TOKENS_ERROR, caughtError, meta);
  }
}

export default function* mintTokensMetaActionSaga() {
  yield takeEvery(ActionTypes.META_MINT_TOKENS, createMintTokensMetaAction);
}
