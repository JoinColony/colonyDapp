/* @flow */

import type { Address, WithKey } from '~types';

import type { UniqueActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';
import type { InboxItemType, UserActivityType } from '~immutable';

export type InboxItemsActionTypes = {|
  INBOX_ITEMS_FETCH: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH,
    {| walletAddress: Address |},
    void,
  >,
  INBOX_ITEMS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH_ERROR,
    WithKey,
  >,
  INBOX_ITEMS_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH_SUCCESS,
    {|
      activities: UserActivityType[],
    |},
    void,
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
