import { WithKey } from '~types/index';
import { UniqueActionType, ErrorActionType } from './index';

import { ActionTypes } from '../../index';

export type InboxItemsActionTypes =
  | UniqueActionType<ActionTypes.INBOX_ITEMS_FETCH, object, object>
  | ErrorActionType<ActionTypes.INBOX_ITEMS_FETCH_ERROR, WithKey>
  | UniqueActionType<
      ActionTypes.INBOX_ITEMS_FETCH_SUCCESS,
      {
        activities: object[];
      },
      object
    >;
