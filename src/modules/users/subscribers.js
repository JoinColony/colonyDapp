/* @flow */

import { userSelector } from './selectors';
import { userSubStart, userSubStop } from './actionCreators';

// eslint-disable-next-line import/prefer-default-export
export const userSubscriber = Object.freeze({
  select: userSelector,
  start: userSubStart,
  stop: userSubStop,
});
