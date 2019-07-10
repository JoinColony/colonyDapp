/* @flow */

// Don't forget to like and subscribe! Add a comment below if you
// liked the file, or if you didn't like the file, that would really
// help me out. Please support my Patreon! Subscribers get access
// to exclusive action creators.

import {
  taskFeedItemsSubStart,
  taskFeedItemsSubStop,
  taskSubStart,
  taskSubStop,
} from './actionCreators';
import {
  taskFeedItemsSelector,
  taskSelector,
  tasksByIdsSelector,
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
