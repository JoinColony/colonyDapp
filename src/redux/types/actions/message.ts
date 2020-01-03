import {
  ActionTypeWithPayload,
  ActionTypes,
  UniqueActionType,
} from '~redux/index';
import { ErrorActionType } from './index';

export type MessageActionTypes =
  | ActionTypeWithPayload<
      ActionTypes.MESSAGE_CREATED,
      { id: string; purpose?: string; message: string; createdAt?: Date }
    >
  | UniqueActionType<ActionTypes.MESSAGE_SIGN, { id: string }, object>
  | UniqueActionType<
      ActionTypes.MESSAGE_SIGNED,
      { id: string; message?: string; signature: string },
      object
    >
  | ErrorActionType<
      ActionTypes.MESSAGE_ERROR,
      { id: string; messageId: string }
    >
  | ActionTypeWithPayload<ActionTypes.MESSAGE_CANCEL, { id: string }>;
