/* @flow */

import type { CoreMessagesRecord } from '~immutable';
import type { ReducerType } from '~redux';

import { fromJS } from 'immutable';

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
    case ACTIONS.MESSAGE_SIGN: {
      const { id } = action.payload;
      return state.mergeIn(
        [CORE_MESSAGES_LIST, id],
        fromJS({ status: 'pending' }),
      );
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
