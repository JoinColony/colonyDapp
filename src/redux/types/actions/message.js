/* @flow */

import type { ActionTypeWithPayload } from '~redux';
import type { ErrorActionType } from '../index';

import { ACTIONS } from '../../index';

export type MessageActionTypes = {|
  MESSAGE_CREATED: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_CREATED,
    {| id?: string, purpose?: string, message: string, createdAt?: Date |},
  >,
  MESSAGE_SIGN: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_SIGN,
    {| id: string |},
  >,
  MESSAGE_SIGNED: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_SIGNED,
    {| id: string, message: string, signature: string |},
  >,
  MESSAGE_ERROR: ErrorActionType<typeof ACTIONS.MESSAGE_ERROR, void>,
  MESSAGE_CANCEL: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_CANCEL,
    {| id: string |},
  >,
|};
