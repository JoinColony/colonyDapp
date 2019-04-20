/* @flow */

import type { Channel, Saga } from 'redux-saga';

import { all, call, put, race, take, select } from 'redux-saga/effects';

import type { ErrorActionType, TakeFilter } from '~redux';
import type { Command, Query } from '../../data/types';

import { getContext } from '~context';
import { validateSync } from '~utils/yup';
import { isDev, log } from '~utils/debug';

/*
 * Effect to take a specific action from a channel
 */
export const takeFrom = (channel: Channel<*>, type: string) =>
  call(function* takeFromSaga() {
    while (true) {
      const action = yield take(channel);
      // Take out errors that were previously handled and throw them again for better control flow
      if (action.error) {
        throw action.payload;
      }
      if (action.type === type) {
        return action;
      }
    }
  });

/*
 * Effect to create a new class instance of Class (use instead of "new Class")
 */
export const create = (Class: Function, ...args: any[]) =>
  call(() => new Class(...args));

/*
 * Effect to put a consistent error action
 */
export const putError = (type: string, error: Error, meta?: Object = {}) => {
  const action: ErrorActionType<typeof type, typeof meta> = {
    type,
    meta,
    error: true,
    payload: error,
  };
  if (isDev) {
    log(error);
    Object.assign(action.meta, {
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
  return put(action);
};

/**
 * Races the `take` of two actions, one success and one error. If success is
 * first, function returns. If error is first, function throws.
 */
export const raceError = (
  successAction: string | TakeFilter,
  errorAction: string | TakeFilter,
  error?: Error,
) => {
  function* raceErrorGenerator(): Saga<void> {
    const result = yield race([take(successAction), take(errorAction)]);
    if (result.type === errorAction) throw error || new Error(result.payload);
    return result;
  }
  return call(raceErrorGenerator);
};

export function* executeQuery<D: *, M: *, A: *, R: *>(
  query: Query<D, M, A, R>,
  {
    args,
    metadata,
  }: {
    args?: A,
    metadata: M,
  },
): Saga<R> {
  const { context, execute, prepare } = query;
  // TODO: Validate context contains context keys only and that it has at least one key
  if (!context) throw new Error('Cannot execute query, context not defined');
  if (!(context && context.length > 0)) {
    throw new Error('Cannot execute query, invalid context');
  }
  if (!execute) {
    throw new Error('Cannot execute query, "execute" function not defined');
  }
  if (!prepare) {
    throw new Error('Cannot execute query, "prepare" function not defined');
  }

  const queryContext = yield all(
    context.reduce(
      (ctx, key) => ({
        ...ctx,
        [key]: call(getContext, key),
      }),
      {},
    ),
  );
  const dependencies = yield call(prepare, queryContext, metadata);
  return yield call(execute, dependencies, args);
}

export function* executeCommand<D: *, M: *, A: *, R: *>(
  command: Command<D, M, A, R>,
  {
    args,
    metadata,
  }: {
    args: A,
    metadata: M,
  },
): Saga<R> {
  const { context, execute, prepare, schema } = command;
  // TODO: Validate context contains context keys only and that it has at least one key
  if (!context) throw new Error('Cannot execute command, context not defined');
  if (!(context && context.length > 0)) {
    throw new Error('Cannot execute command, invalid context');
  }
  if (!execute) {
    throw new Error('Cannot execute command, "execute" function not defined');
  }
  if (!prepare) {
    throw new Error('Cannot execute command, "prepare" function not defined');
  }

  const commandContext = yield all(
    context.reduce(
      (ctx, key) => ({
        ...ctx,
        [key]: call(getContext, key),
      }),
      {},
    ),
  );
  const dependencies = yield call(prepare, commandContext, metadata);
  const maybeSanitizedArgs = schema ? validateSync(schema)(args) : args;
  return yield call(execute, dependencies, maybeSanitizedArgs);
}

export function* selectAsJS(
  selector: (...any) => any,
  ...args: any
): Saga<any> {
  const selected = yield select(selector, ...args);
  return selected && typeof selected.toJS == 'function'
    ? selected.toJS()
    : selected;
}
