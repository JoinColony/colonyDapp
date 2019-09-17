import { fromJS } from 'immutable';
import { Message, TRANSACTION_STATUSES } from '~immutable/index';
import { ReducerType, ActionTypes } from '~redux/index';

import { CoreMessages, CoreMessagesRecord } from '../state/index';
import { CORE_MESSAGES_LIST } from '../constants';

const coreMessagesReducer: ReducerType<CoreMessagesRecord> = (
  state = CoreMessages(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.MESSAGE_CREATED: {
      const message = Message(action.payload);
      return state.setIn([CORE_MESSAGES_LIST, message.id], message);
    }
    case ActionTypes.MESSAGE_SIGN: {
      const { id } = action.payload;
      return state.mergeIn(
        [CORE_MESSAGES_LIST, id],
        fromJS({ status: TRANSACTION_STATUSES.PENDING }),
      );
    }
    case ActionTypes.MESSAGE_SIGNED: {
      const { id, signature } = action.payload;
      return state.mergeIn(
        [CORE_MESSAGES_LIST, id],
        fromJS({
          signature,
          status: TRANSACTION_STATUSES.SUCCEEDED,
        }),
      );
    }
    case ActionTypes.MESSAGE_ERROR: {
      const { messageId } = action.meta;
      return state.updateIn(
        [CORE_MESSAGES_LIST, messageId, 'status'],
        () => TRANSACTION_STATUSES.FAILED,
      );
    }
    case ActionTypes.MESSAGE_CANCEL: {
      const { id } = action.payload;
      return state.deleteIn([CORE_MESSAGES_LIST, id]);
    }
    default:
      return state;
  }
};

export default coreMessagesReducer;
