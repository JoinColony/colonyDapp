/* @flow */

import type { Action } from '~redux/types';

type Next = (Action<*>) => any;

// eslint-disable-next-line import/prefer-default-export
export const createSubscriberMiddleware = (...actionPairs: string[][]) => {
  const startActions = new Set<string>(actionPairs.map(([start]) => start));
  const stopActions = new Map<string, string>(
    actionPairs.map(([start, stop]) => [stop, start]),
  );
  const subscriptionCounts = new Map<string, number>();

  return () => (next: Next) => (action: Action<*>) => {
    const { type, meta } = action;

    const isStartAction = startActions.has(type);
    const isStopAction = stopActions.has(type);

    if (isStartAction) {
      const key = type + (meta ? meta.key : '');
      const subCount = subscriptionCounts.get(key) || 0;

      // increment subCount
      subscriptionCounts.set(key, subCount + 1);

      // if we already have subscribers, don't forward the SUB_START action
      if (subCount > 0) {
        // $FlowFixMe
        return null;
      }
    }

    if (isStopAction) {
      // use the start action for the key, get that from stopActions map
      const key = (stopActions.get(type) || '') + (meta ? meta.key : '');
      const subCount = subscriptionCounts.get(key) || 0;

      // decrement subCount if it's not already zero
      if (subCount > 0) {
        subscriptionCounts.set(key, subCount - 1);
      }

      // if this wasn't the last subscriber, don't forward the SUB_STOP action
      if (subCount > 1) {
        // $FlowFixMe
        return null;
      }
    }

    return next(action);
  };
};
