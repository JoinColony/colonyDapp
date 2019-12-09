import {
  colonyTaskMetadataSubStart,
  colonyTaskMetadataSubStop,
  taskFeedItemsSubStart,
  taskFeedItemsSubStop,
} from './actionCreators';
import {
  colonyTaskMetadataSelector,
  taskFeedItemsSelector,
} from './selectors';

export const taskFeedItemsSubscriber = Object.freeze({
  select: taskFeedItemsSelector,
  start: taskFeedItemsSubStart,
  stop: taskFeedItemsSubStop,
});

export const colonyTaskMetadataSubscriber = Object.freeze({
  select: colonyTaskMetadataSelector,
  start: colonyTaskMetadataSubStart,
  stop: colonyTaskMetadataSubStop,
});
