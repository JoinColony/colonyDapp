/* @flow */

import { Map as ImmutableMap, List } from 'immutable';

import type { ReducerType } from '~redux';
import type { TaskFeedItemsMap, TaskFeedItemRecordType } from '~immutable';
import type { AllTaskEvents } from '../data/queries';

import {
  DataRecord,
  TaskCommentRecord,
  TaskEventRecord,
  TaskFeedItemRecord,
} from '~immutable';
import { ACTIONS } from '~redux';
import { withDataRecordMap } from '~utils/reducers';
import { TASK_EVENT_TYPES } from '~data/constants';

const {
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
} = TASK_EVENT_TYPES;

const FEED_ITEM_TYPES = new Set([
  COMMENT_POSTED,
  DOMAIN_SET,
  DUE_DATE_SET,
  PAYOUT_SET,
  SKILL_SET,
  TASK_CANCELLED,
  TASK_CLOSED,
  TASK_CREATED,
  TASK_DESCRIPTION_SET,
  TASK_FINALIZED,
  TASK_TITLE_SET,
  WORK_INVITE_SENT,
  WORK_REQUEST_CREATED,
  WORKER_ASSIGNED,
  WORKER_UNASSIGNED,
]);

/*
 * Given a task event, return props needed for a `TaskFeedItemRecord`
 * depending on that event's `type` and `payload`.
 */
const getTaskFeedItemRecordProps = (event: *) => {
  switch (event.type) {
    /**
     * @todo  handle rating props when ratings are re-introduced
     */
    case COMMENT_POSTED: {
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

const mapTaskFeedItemEvent = (event: AllTaskEvents): TaskFeedItemRecordType =>
  TaskFeedItemRecord({
    createdAt: new Date(event.meta.timestamp),
    id: event.meta.id,
    ...getTaskFeedItemRecordProps(event),
  });

const taskFeedItemsReducer: ReducerType<
  TaskFeedItemsMap,
  {
    TASK_FEED_ITEMS_SUB_START: *,
    TASK_FEED_ITEMS_SUB_EVENTS: *,
  },
> = (state = ImmutableMap(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_FEED_ITEMS_SUB_EVENTS: {
      const { draftId, events } = action.payload;

      const record = List<TaskFeedItemRecordType>(
        events
          .filter(event => FEED_ITEM_TYPES.has(event.type))
          .map(mapTaskFeedItemEvent),
      );
      return state.set(draftId, DataRecord({ record }));
    }

    default:
      return state;
  }
};

export default withDataRecordMap(
  ACTIONS.TASK_FEED_ITEMS_SUB_START,
  ImmutableMap(),
)(taskFeedItemsReducer);
