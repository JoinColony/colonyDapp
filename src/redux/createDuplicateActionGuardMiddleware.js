/* @flow */

import type { Action } from '~redux/types';

type Next = (Action<*>) => any;

// eslint-disable-next-line import/prefer-default-export
export const createDuplicateActionGuardMiddleware = (
  timeout: number,
  ...actionTypesToGuard: string[]
) => {
  const actions = new Set(actionTypesToGuard);
  const recentlyDispatched = new Set<string>();

  return () => (next: Next) => (action: Action<*>) => {
    const { type, meta } = action;

    // For now, only guard against actions with meta.key, because
    // this kind of action should return the same result when called
    // in quick succession.
    if (actions.has(type) && meta && meta.key) {
      const key: string = type + meta.key;

      if (recentlyDispatched.has(key)) {
        // $FlowFixMe This is breaking the rules, but not calling next.
        return null;
      }

      recentlyDispatched.add(key);
      setTimeout(() => {
        recentlyDispatched.delete(key);
      }, timeout);
    }
    return next(action);
  };
};
