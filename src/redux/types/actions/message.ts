import { ActionTypeWithPayload, ActionTypes } from '~redux/index';
import { ErrorActionType } from './index';

export type MessageActionTypes =
  | ActionTypeWithPayload<
      ActionTypes.MESSAGE_CREATED,
      { id: string; purpose?: string; message: string; createdAt?: Date }
    >
  | ActionTypeWithPayload<ActionTypes.MESSAGE_SIGN, { id: string }>
  | ActionTypeWithPayload<
      ActionTypes.MESSAGE_SIGNED,
      { id: string; message?: string; signature: string }
    >
  | ErrorActionType<
      ActionTypes.MESSAGE_ERROR,
      { id: string; messageId: string }
    >
  | ActionTypeWithPayload<ActionTypes.MESSAGE_CANCEL, { id: string }>;
