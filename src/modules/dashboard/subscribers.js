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
  colonySubStart,
  colonySubStop,
} from './actionCreators';

import {
  taskFeedItemsSelector,
  taskSelector,
  tasksByIdsSelector,
  colonySelector,
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

export const colonySubscriber = Object.freeze({
  select: colonySelector,
  start: colonySubStart,
  stop: colonySubStop,
});
