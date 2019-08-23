import { userSelector } from './selectors';
import { userSubStart, userSubStop } from './actionCreators';

export const userSubscriber = Object.freeze({
  select: userSelector,
  start: userSubStart,
  stop: userSubStop,
});
