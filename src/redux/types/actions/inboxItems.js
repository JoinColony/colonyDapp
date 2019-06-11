/* @flow */

import type { Address, WithKey } from '~types';

import type {
  UniqueActionType,
  ErrorActionType,
  ActionTypeWithPayloadAndMeta,
} from '../index';

import { ACTIONS } from '../../index';
import type { InboxItemType } from '~immutable';

export type InboxItemsActionTypes = {|
  INBOX_ITEMS_FETCH: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.INBOX_ITEMS_FETCH,
    {|
      colonyAddress: Address,
    |},
    {|
      id: string,
      key: *,
      colonyAddress: Address,
    |},
  >,
  INBOX_ITEMS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH_ERROR,
    WithKey,
  >,
  INBOX_ITEMS_FETCH_SUCCESS: ActionTypeWithPayloadAndMeta<
    typeof ACTIONS.INBOX_ITEMS_FETCH_SUCCESS,
    {|
      activities: InboxItemType[],
    |},
    {|
      id: string,
      key: *,
      colonyAddress?: Address,
    |},
  >,
  INBOX_ITEMS_ADD: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_ADD,
    {|
      activity: *,
      address: Address,
    |},
    WithKey,
  >,
  INBOX_ITEMS_ADD_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_ITEMS_ADD_ERROR,
    WithKey,
  >,
  INBOX_ITEMS_ADD_SUCCESS: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_ADD_SUCCESS,
    {|
      activity: InboxItemType,
    |},
    WithKey,
  >,
|};
