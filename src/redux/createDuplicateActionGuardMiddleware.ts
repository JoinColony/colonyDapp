import { Action } from 'redux';

export const createDuplicateActionGuardMiddleware = (
  timeout: number,
  ...actionTypesToGuard: string[]
) => {
  const actions = new Set(actionTypesToGuard);
  const recentlyDispatched = new Set<string>();

  return () => (next: (action: Action) => Action) => (action: Action) => {
    const { type, meta } = action as any;

    // For now, only guard against actions with meta.key, because
    // this kind of action should return the same result when called
    // in quick succession.
    if (actions.has(type) && meta && meta.key) {
      const key: string = type + meta.key;

      if (recentlyDispatched.has(key)) {
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
