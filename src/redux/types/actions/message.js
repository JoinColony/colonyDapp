/* @flow */

import type { ActionTypeWithPayloadAndMeta } from '~redux';

import { ACTIONS } from '../../index';

export type MessageActionTypes = {|
  MESSAGE_CREATED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MESSAGE_CREATED,
    {| message: string |},
  >,
  MESSAGE_SIGNED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MESSAGE_SIGNED,
    {| signature: string |},
  >,
  MESSAGE_SUCCEEDED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MESSAGE_SUCCEEDED,
    {| message: string, signature: string |},
  >,
|};
