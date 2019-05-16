/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskFeedItemsMap } from '~immutable';

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
        content: { author, body, metadata: { mentions } = {} },
      } = event.payload;
      return {
        comment: TaskCommentRecord({
          authorAddress: author,
          body,
          mentions: List(mentions),
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

const taskFeedItemsReducer: ReducerType<
  TaskFeedItemsMap,
  {
    TASK_CANCEL_SUCCESS: *,
    TASK_CLOSE_SUCCESS: *,
    TASK_COMMENT_ADD_SUCCESS: *,
    TASK_CREATE_SUCCESS: *,
    TASK_FEED_ITEMS_FETCH_SUCCESS: *,
    TASK_FEED_ITEMS_LQ_START: *,
    TASK_FEED_ITEMS_LQ_YIELD: *,
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
    case ACTIONS.TASK_FEED_ITEMS_FETCH_SUCCESS: {
      const { draftId, events } = action.payload;
      return state.set(
        draftId,
        DataRecord({
          record: List(events.map(createTaskFeedItemRecord)),
        }),
      );
    }

    case ACTIONS.TASK_FEED_ITEMS_LQ_START: {
      const { draftId } = action.payload;
      return state.getIn([draftId, 'record'])
        ? state
        : state.set(
            draftId,
            DataRecord({
              record: List(),
            }),
          );
    }

    case ACTIONS.TASK_FEED_ITEMS_LQ_YIELD: {
      const { draftId, event } = action.payload;
      return state
        .getIn([draftId, 'record'] || List())
        .find(({ id }) => id === event.meta.id)
        ? state
        : state.updateIn([draftId, 'record'], list =>
            list.push(createTaskFeedItemRecord(event)),
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
      const path = [draftId, 'record'];

      const update = (items: *) =>
        /*
         * Ensure that the state contains unique events by only adding them
         * when the event's id wasn't found in the existing items.
         */
        items.find(item => item.id === event.meta.id)
          ? items
          : items.push(createTaskFeedItemRecord(event));

      return state.getIn(path)
        ? state.updateIn(path, items => items && update(items))
        : state.set(
            draftId,
            DataRecord({
              record: update(List()),
            }),
          );
    }

    default:
      return state;
  }
};

export default withDataRecordMap(ACTIONS.TASK_FEED_ITEMS_FETCH, ImmutableMap())(
  taskFeedItemsReducer,
);
