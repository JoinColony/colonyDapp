/* @flow */

import type { Address, WithKey } from '~types';
import type { UniqueActionType, ErrorActionType } from '../index';

import { ACTIONS } from '../../index';

export type InboxItemsActionTypes = {|
  INBOX_ITEMS_FETCH: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH,
    void,
    void,
  >,
  INBOX_ITEMS_FETCH_ERROR: ErrorActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH_ERROR,
    WithKey,
  >,
  INBOX_ITEMS_FETCH_SUCCESS: UniqueActionType<
    typeof ACTIONS.INBOX_ITEMS_FETCH_SUCCESS,
    {|
      activities: Array<Object>,
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
      activity: Object,
    |},
    WithKey,
  >,
|};
