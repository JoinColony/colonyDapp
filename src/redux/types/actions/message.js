/* @flow */

import type { ActionTypeWithPayloadAndMeta } from '~redux';

import { ACTIONS } from '../../index';

type WithId = {| id: string |};

export type MessageActionTypes = {|
  MESSAGE_CREATED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MESSAGE_CREATED,
    {| message: string |},
    WithId,
  >,
  MESSAGE_SIGNED: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.MESSAGE_SIGNED,
    {| message: string, signature: string |},
    WithId,
  >,
|};
