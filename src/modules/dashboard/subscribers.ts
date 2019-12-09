import {
  colonyTaskMetadataSubStart,
  colonyTaskMetadataSubStop,
  taskFeedItemsSubStart,
  taskFeedItemsSubStop,
  taskSubStart,
  taskSubStop,
} from './actionCreators';
import {
  colonySelector,
  colonyTaskMetadataSelector,
  taskFeedItemsSelector,
  tasksByIdsSelector,
  taskSelector,
} from './selectors';

export const taskFeedItemsSubscriber = Object.freeze({
  select: taskFeedItemsSelector,
  start: taskFeedItemsSubStart,
  stop: taskFeedItemsSubStop,
});

export const taskSubscriber = Object.freeze({
  select: taskSelector,
  start: taskSubStart,
  stop: taskSubStop,
});

export const tasksByIdSubscriber = Object.freeze({
  select: tasksByIdsSelector,
  start: taskSubStart,
  stop: taskSubStop,
});

export const colonyTaskMetadataSubscriber = Object.freeze({
  select: colonyTaskMetadataSelector,
  start: colonyTaskMetadataSubStart,
  stop: colonyTaskMetadataSubStop,
});
