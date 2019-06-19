/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskFeedItemsMap, TaskFeedItemRecordType } from '~immutable';

import {
  DataRecord,
  TaskCommentRecord,
  TaskEventRecord,
  TaskFeedItemRecord,
} from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';
import { TASK_EVENT_TYPES } from '~data/constants';

/*
 * Given a task event, return props needed for a `TaskFeedItemRecord`
 * depending on that event's `type` and `payload`.
 */
const getTaskFeedItemRecordProps = (event: *) => {
  switch (event.type) {
    /**
     * @todo  handle rating props when ratings are re-introduced
     */
    case TASK_EVENT_TYPES.COMMENT_POSTED: {
      const {
        signature,
        content: { author, body },
      } = event.payload;
      return {
        comment: TaskCommentRecord({
          authorAddress: author,
          body,
          signature,
        }),
      };
    }

    default: {
      return {
        event: TaskEventRecord(event),
      };
    }
  }
};

const createTaskFeedItemRecord = (event: *) =>
  TaskFeedItemRecord({
    /*
     * Common properties for all feed items taken from `meta`.
     */
    createdAt: new Date(event.meta.timestamp),
    id: event.meta.id,
    /*
     * Properties dependent on the event `type`.
     */
    ...getTaskFeedItemRecordProps(event),
  });

const insertFeedItem = (list: List<*>, record: TaskFeedItemRecordType) => {
  const last = list.last();
  if (!last || record.createdAt >= last.createdAt) {
    return list.push(record);
  }

  const index = list.findIndex(
    ({ createdAt }) => createdAt >= record.createdAt,
  );

  return list.insert(index, record);
};

const updateStateForSubscription = (state: *, draftId: string) =>
  // $FlowFixMe this is fine...
  state.getIn([draftId, 'record']) ? state : state.set(draftId, DataRecord());

const updateStateForEvent = (state: *, draftId: string, event: *) => {
  const newState = updateStateForSubscription(state, draftId);

  const idExists = newState
    .getIn([draftId, 'record'], List())
    .find(item => item.id === event.meta.id);

  return idExists
    ? newState
    : newState.updateIn(
        [draftId, 'record'],
        list => list && insertFeedItem(list, createTaskFeedItemRecord(event)),
      );
};

const taskFeedItemsReducer: ReducerType<
  TaskFeedItemsMap,
  {
    TASK_CANCEL_SUCCESS: *,
    TASK_CLOSE_SUCCESS: *,
    TASK_COMMENT_ADD_SUCCESS: *,
    TASK_CREATE_SUCCESS: *,
    TASK_FEED_ITEMS_SUB_START: *,
    TASK_FEED_ITEMS_SUB_EVENTS: *,
    TASK_FINALIZE_SUCCESS: *,
    TASK_SEND_WORK_INVITE_SUCCESS: *,
    TASK_SEND_WORK_REQUEST_SUCCESS: *,
    TASK_SET_DESCRIPTION_SUCCESS: *,
    TASK_SET_DOMAIN_SUCCESS: *,
    TASK_SET_DUE_DATE_SUCCESS: *,
    TASK_SET_PAYOUT_SUCCESS: *,
    TASK_SET_SKILL_SUCCESS: *,
    TASK_SET_TITLE_SUCCESS: *,
    TASK_WORKER_ASSIGN_SUCCESS: *,
    TASK_WORKER_UNASSIGN_SUCCESS: *,
  },
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_FEED_ITEMS_SUB_START: {
      const { draftId } = action.payload;
      return updateStateForSubscription(state, draftId);
    }

    case ACTIONS.TASK_FEED_ITEMS_SUB_EVENTS: {
      const { draftId, events } = action.payload;
      return state.setIn(
        [draftId, 'record'],
        List(events.map(createTaskFeedItemRecord)),
      );
    }

    /*
     * Almost all of the task actions are expected to have an `event`
     * property which we can interpret as a task feed item.
     */
    case ACTIONS.TASK_CANCEL_SUCCESS:
    case ACTIONS.TASK_CLOSE_SUCCESS:
    case ACTIONS.TASK_COMMENT_ADD_SUCCESS:
    case ACTIONS.TASK_CREATE_SUCCESS:
    case ACTIONS.TASK_FINALIZE_SUCCESS:
    case ACTIONS.TASK_SEND_WORK_INVITE_SUCCESS:
    case ACTIONS.TASK_SEND_WORK_REQUEST_SUCCESS:
    case ACTIONS.TASK_SET_DESCRIPTION_SUCCESS:
    case ACTIONS.TASK_SET_DOMAIN_SUCCESS:
    case ACTIONS.TASK_SET_DUE_DATE_SUCCESS:
    case ACTIONS.TASK_SET_PAYOUT_SUCCESS:
    case ACTIONS.TASK_SET_SKILL_SUCCESS:
    case ACTIONS.TASK_SET_TITLE_SUCCESS:
    case ACTIONS.TASK_WORKER_ASSIGN_SUCCESS:
    case ACTIONS.TASK_WORKER_UNASSIGN_SUCCESS: {
      const { draftId, event } = action.payload;
      return updateStateForEvent(state, draftId, event);
    }

    default:
      return state;
  }
};

export default withDataRecordMap(
  ACTIONS.TASK_FEED_ITEMS_SUB_START,
  ImmutableMap(),
)(taskFeedItemsReducer);
