/* @flow */

import type { CoreMessagesRecord } from '~immutable';

import type { ReducerType } from '~redux';

import { MessageRecord, CoreMessages } from '~immutable';
import { ACTIONS } from '~redux';

import { CORE_MESSAGES_LIST } from '../constants';

const coreMessagesReducer: ReducerType<
  CoreMessagesRecord,
  {|
    MESSAGE_CREATED: *,
  |},
> = (state = CoreMessages(), action) => {
  switch (action.type) {
    case ACTIONS.MESSAGE_CREATED: {
      const {
        meta: { id },
      } = action;
      return state.setIn(
        [CORE_MESSAGES_LIST, id],
        MessageRecord(action.payload),
      );
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
