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
      const message = MessageRecord(action.payload);
      return state.setIn([CORE_MESSAGES_LIST, message.id], message);
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
