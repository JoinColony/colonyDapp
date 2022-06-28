import { nanoid } from 'nanoid';
import { call, put, race, take } from 'redux-saga/effects';
import { Arrayish } from 'ethers/utils';
import { isArrayish } from 'ethers/utils/bytes';
import { SignMessageData } from '@purser/core';

import { putError } from '~utils/saga/effects';
import { ActionTypes } from '~redux/index';
import { AllActions } from '~redux/types/actions';
import { ContextModule, TEMP_getContext } from '~context/index';

export function* signMessage(purpose: string, message: Arrayish) {
  const wallet = TEMP_getContext(ContextModule.Wallet);

  if (!wallet) throw new Error('Could not get wallet');

  const messageId = `${nanoid(10)}-signMessage`;
  /*
   * @NOTE Initiate the message signing process
   */
  yield put<AllActions>({
    type: ActionTypes.MESSAGE_CREATED,
    payload: {
      id: messageId,
      purpose,
      message: JSON.stringify(message),
      createdAt: new Date(),
    },
  });

  /*
   * @NOTE Wait (block) until there's a matching action
   * for sign or cancel and get its generated id for the async listener
   */
  const [signAction, cancelAction] = yield race([
    take(
      (action: AllActions) =>
        action.type === ActionTypes.MESSAGE_SIGN &&
        action.payload.id === messageId,
    ),
    take(
      (action: AllActions) =>
        action.type === ActionTypes.MESSAGE_CANCEL &&
        action.payload.id === messageId,
    ),
  ]);

  if (cancelAction) throw new Error('User cancelled signing of message');

  const {
    meta: { id },
  } = signAction;

  try {
    const signature = yield call(
      [wallet, wallet.signMessage],
      (isArrayish(message)
        ? { messageData: message }
        : { message }) as SignMessageData,
    );

    yield put<AllActions>({
      type: ActionTypes.MESSAGE_SIGNED,
      payload: { id: messageId, signature },
      meta: { id },
    });
    return signature;
  } catch (caughtError) {
    yield putError(ActionTypes.MESSAGE_ERROR, caughtError, {
      messageId,
      id,
    });
    throw caughtError;
  }
}
