import nanoid from 'nanoid';
import { call, put, take } from 'redux-saga/effects';

import { putError } from '~utils/saga/effects';
import { ActionTypes } from '~redux/index';
import { AllActions } from '~redux/types/actions';
import { Context, getContext } from '~context/index';

export function* signMessage(purpose, message) {
  const wallet = yield getContext(Context.WALLET);
  const messageId = `${nanoid(10)}-signMessage`;
  /*
   * @NOTE Initiate the message signing process
   */
  const messageString = JSON.stringify(message);
  yield put<AllActions>({
    type: ActionTypes.MESSAGE_CREATED,
    payload: {
      id: messageId,
      purpose,
      message: messageString,
      createdAt: new Date(),
    },
  });

  /*
   * @NOTE Wait (block) until there's a matching action
   * and get its generated id for the async listener
   */
  const {
    meta: { id },
  } = yield take(
    (action: AllActions) =>
      action.type === ActionTypes.MESSAGE_SIGN &&
      action.payload.id === messageId,
  );
  try {
    const signature = yield call([wallet, wallet.signMessage], {
      message: messageString,
    });

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
