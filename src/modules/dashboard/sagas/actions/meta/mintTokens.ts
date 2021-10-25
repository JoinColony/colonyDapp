import { put, takeEvery } from 'redux-saga/effects';
import { ClientType, ColonyClient } from '@colony/colony-js';
import { soliditySha3 } from 'web3-utils';

import { getLoggedInUser } from '~data/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { Action, ActionTypes, AllActions } from '~redux/index';
import { putError } from '~utils/saga/effects';

/*
 * @TODO This is not a real action saga... yet
 * It's just being used as an example to be able generate a basic metatransactions
 * The rest of the content for this saga will be added by
 * https://github.com/JoinColony/colonyDapp/pull/2779
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

    console.log(colonyClient.provider);

    const metatransactionMessage = soliditySha3(
      { t: 'uint256', v: currentNonce.toString() },
      { t: 'address', v: colonyClient.address },
      { t: 'uint256', v: 1337 },
      { t: 'bytes', v: encodedTransaction },
    );

    console.log('message', metatransactionMessage);

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
