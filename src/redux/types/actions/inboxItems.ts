import { ActionType, ActionTypeWithPayload, ErrorActionType } from './index';

import { ActionTypes } from '../../index';

export type InboxItemsActionTypes =
  | ActionType<ActionTypes.INBOX_ITEMS_FETCH>
  | ErrorActionType<ActionTypes.INBOX_ITEMS_FETCH_ERROR, void>
  | ActionTypeWithPayload<
      ActionTypes.INBOX_ITEMS_FETCH_SUCCESS,
      {
        activities: object[];
      }
    >;
