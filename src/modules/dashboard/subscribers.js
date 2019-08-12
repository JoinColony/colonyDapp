/* @flow */

// Don't forget to like and subscribe! Add a comment below if you
// liked the file, or if you didn't like the file, that would really
// help me out. Please support my Patreon! Subscribers get access
// to exclusive action creators.

import {
  colonySubStart,
  colonySubStop,
  colonyTaskMetadataSubStart,
  colonyTaskMetadataSubStop,
  taskFeedItemsSubStart,
  taskFeedItemsSubStop,
  taskSubStart,
  taskSubStop,
} from './actionCreators';
import {
  userColoniesSubStart,
  userColoniesSubStop,
  currentUserTasksSubStart,
  currentUserTasksSubStop,
} from '../users/actionCreators';

import {
  colonySelector,
  colonyTaskMetadataSelector,
  taskFeedItemsSelector,
  tasksByIdsSelector,
  taskSelector,
} from './selectors';
import {
  userColoniesSelector,
  currentUserDraftIdsSelector,
} from '../users/selectors';

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

export const colonyTaskMetadataSubscriber = Object.freeze({
  select: colonyTaskMetadataSelector,
  start: colonyTaskMetadataSubStart,
  stop: colonyTaskMetadataSubStop,
});

export const userColoniesSubscriber = Object.freeze({
  select: userColoniesSelector,
  start: userColoniesSubStart,
  stop: userColoniesSubStop,
});

export const currentUserTasksSubscriber = Object.freeze({
  select: currentUserDraftIdsSelector,
  start: currentUserTasksSubStart,
  stop: currentUserTasksSubStop,
});
