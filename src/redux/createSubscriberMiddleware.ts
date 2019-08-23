import { Action } from 'redux';

type Next = (action: Action) => any;

export const createSubscriberMiddleware = (...actionPairs: string[][]) => {
  const [startActions, stopActions] = actionPairs.reduce(
    ([startSet, stopMap], [start, stop]) => [
      startSet.add(start),
      stopMap.set(stop, start),
    ],
    [new Set<string>(), new Map<string, string>()],
  );

  const subscriptionCounts = new Map<string, number>();

  return () => (next: Next) => (action: Action) => {
    const { type, meta } = action as any;

    const isStartAction = startActions.has(type);
    const isStopAction = stopActions.has(type);

    if (isStartAction) {
      const key = type + (meta ? meta.key : '');
      const subCount = subscriptionCounts.get(key) || 0;

      // increment subCount
      subscriptionCounts.set(key, subCount + 1);

      // if we already have subscribers, don't forward the SUB_START action
      if (subCount > 0) {
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
        return null;
      }
    }

    return next(action);
  };
};
