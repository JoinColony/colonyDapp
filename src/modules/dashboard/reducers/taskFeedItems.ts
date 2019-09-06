import { Map as ImmutableMap, List, fromJS } from 'immutable';

import { ReducerType, ActionTypes } from '~redux/index';
import {
  TaskFeedItemsMap,
  TaskFeedItemRecordType,
  FetchableData,
  TaskCommentRecord,
  TaskEventRecord,
  TaskFeedItemRecord,
} from '~immutable/index';
import { withFetchableDataMap } from '~utils/reducers';
import { EventTypes } from '~data/constants';
import { AllEvents } from '~data/types';

const FEED_ITEM_TYPES = new Set([
  EventTypes.COMMENT_POSTED,
  EventTypes.DOMAIN_SET,
  EventTypes.DUE_DATE_SET,
  EventTypes.PAYOUT_SET,
  EventTypes.PAYOUT_REMOVED,
  EventTypes.SKILL_SET,
  EventTypes.TASK_CANCELLED,
  EventTypes.TASK_CLOSED,
  EventTypes.TASK_CREATED,
  EventTypes.TASK_DESCRIPTION_SET,
  EventTypes.TASK_FINALIZED,
  EventTypes.TASK_TITLE_SET,
  EventTypes.WORK_INVITE_SENT,
  EventTypes.WORK_REQUEST_CREATED,
  EventTypes.WORKER_ASSIGNED,
  EventTypes.WORKER_UNASSIGNED,
]);

/*
 * Given a task event, return props needed for a `TaskFeedItemRecord`
 * depending on that event's `type` and `payload`.
 */
const getTaskFeedItemRecordProps = (event: any) => {
  switch (event.type) {
    /**
     * @todo  handle rating props when ratings are re-introduced
     */
    case EventTypes.COMMENT_POSTED: {
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

const mapTaskFeedItemEvent = (event: AllEvents): TaskFeedItemRecordType =>
  TaskFeedItemRecord(
    fromJS({
      createdAt: new Date(event.meta.timestamp),
      id: event.meta.id,
      ...getTaskFeedItemRecordProps(event),
    }),
  );

const taskFeedItemsReducer: ReducerType<TaskFeedItemsMap> = (
  state = ImmutableMap(),
  action,
) => {
  switch (action.type) {
    case ActionTypes.TASK_FEED_ITEMS_SUB_EVENTS: {
      const { draftId, events } = action.payload;

      const record = List<TaskFeedItemRecordType>(
        events
          .filter(event => FEED_ITEM_TYPES.has(event.type))
          .map(mapTaskFeedItemEvent),
      );
      return state.set(draftId, FetchableData({ record }));
    }

    default:
      return state;
  }
};

export default withFetchableDataMap(
  ActionTypes.TASK_FEED_ITEMS_SUB_START,
  ImmutableMap(),
)(taskFeedItemsReducer);
