import { ActionPattern } from '@redux-saga/types';
import { Channel } from 'redux-saga';
import {
  all,
  call,
  cancel,
  fork,
  put,
  race,
  take,
  select,
} from 'redux-saga/effects';

import { ErrorActionType, TakeFilter, Action } from '~redux/index';

import { log } from '~utils/debug';

/*
 * Effect to take a specific action from a channel.
 */
export const takeFrom = (channel: Channel<any>, type: string | string[]) =>
  call(function* takeFromSaga() {
    while (true) {
      const action = yield take(channel);
      if (
        (Array.isArray(type) && type.includes(action.type)) ||
        action.type === type
      ) {
        return action;
      }
    }
  });

/*
 * Effect to create a new class instance of Class (use instead of "new Class")
 */
export const create = (Class: Function, ...args: any[]) =>
  // @ts-ignore
  call(() => new Class(...args));

/*
 * Effect to put a consistent error action
 */
export const putError = (type: string, error: Error, meta: object = {}) => {
  const action: ErrorActionType<typeof type, typeof meta> = {
    type,
    meta,
    error: true,
    payload: error,
  };
  log.error(error);
  return put(action);
};

/*
 * Races the `take` of two actions, one success and one error. If success is
 * first, function returns. If error is first, function throws.
 */
export const raceError = (
  successAction: string | TakeFilter,
  errorAction: string | TakeFilter,
  error?: Error,
) => {
  function* raceErrorGenerator() {
    const result = yield race([take(successAction), take(errorAction)]) as any;
    if (result.type === errorAction) throw error || new Error(result.payload);
    return result;
  }
  return call(raceErrorGenerator);
};

export function* selectAsJS(
  selector: (...selectorArgs: any[]) => any,
  ...args: any[]
) {
  const selected = yield select(selector, ...args);
  return selected && typeof selected.toJS === 'function'
    ? selected.toJS()
    : selected;
}

export const takeLatestCancellable = (
  actionOrPattern: ActionPattern,
  cancelActionOrPattern: ActionPattern,
  saga: (action: Action<any>) => Generator<any>,
) => {
  let currentTask;

  return all([
    fork(function* takeLatest() {
      while (true) {
        const action = yield take(actionOrPattern);
        if (currentTask) {
          yield cancel(currentTask); // cancel is no-op if the task has already terminated
        }
        currentTask = yield fork(saga, action);
      }
    }),
    fork(function* cancelCurrent() {
      while (true) {
        yield take(cancelActionOrPattern);
        if (currentTask) {
          yield cancel(currentTask);
        }
      }
    }),
  ]);
};

export function* routeRedirect(
  route: string,
  historyObject, // Apparently react-router doesn't export proper types for this :(
) {
  if (route && historyObject) {
    yield call(historyObject.push, route);
  }
}
