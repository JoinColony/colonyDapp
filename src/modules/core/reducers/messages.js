/* @flow */

import type { CoreMessagesRecord } from '~immutable';

import { MessageRecord, CoreMessages } from '~immutable';
import { ACTIONS } from '~redux';

import type { ReducerType } from '~redux';

import { CORE_MESSAGES } from '../constants';

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
      const messageToSign = MessageRecord();
      return state.setIn([CORE_MESSAGES, id], messageToSign);
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
