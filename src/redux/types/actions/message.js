/* @flow */

import type { ActionTypeWithPayload } from '~redux';

import { ACTIONS } from '../../index';

export type MessageActionTypes = {|
  MESSAGE_CREATED: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_CREATED,
    {| id?: string, message: string |},
  >,
  MESSAGE_SIGN: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_SIGN,
    {| id: string |},
  >,
  MESSAGE_SIGNED: ActionTypeWithPayload<
    typeof ACTIONS.MESSAGE_SIGNED,
    {| id: string, message: string, signature: string |},
  >,
|};
