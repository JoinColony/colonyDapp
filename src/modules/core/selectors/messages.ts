import { createSelector } from 'reselect';

import { RootStateRecord } from '~immutable/index';

import {
  CORE_NAMESPACE as ns,
  CORE_MESSAGES,
  CORE_MESSAGES_LIST,
} from '../constants';

export const messageById = (state: RootStateRecord, id: string) =>
  state.getIn([ns, CORE_MESSAGES, CORE_MESSAGES_LIST, id]);

export const getAllMessages = (state: RootStateRecord) =>
  state.getIn([ns, CORE_MESSAGES, CORE_MESSAGES_LIST]);

/*
 * @NOTE This selector just groups all messages by their respective id
 * (essentially creating unique groups of one message), in order for us to
 * be able to merge them with the transactions groups and display them in the
 * gas station properly
 */
export const messageGroups = createSelector(
  getAllMessages,
  messages =>
    messages
      /*
       * Group by id and convert each group to a list
       */
      .groupBy(message => message.get('id'))
      .map(messageGroup => messageGroup.toList())
      /*
       * Convert the whole map to a List
       */
      .toList()
      /*
       * Sort everything by the 'first' (and only) entry in the group
       * This is only useful if this selector is to be used individually
       */
      .sortBy(messageGroup => messageGroup.first().createdAt),
);
