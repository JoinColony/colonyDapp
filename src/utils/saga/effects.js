/* @flow */

import type { Channel, Saga } from 'redux-saga';

import { call, put, race, take } from 'redux-saga/effects';

import type { ENSName } from '~types';
import type { ErrorActionType, TakeFilter } from '~redux';
import type { Command, Query } from '../../data/types';

import { validateSync } from '~utils/yup';
import { isDev, log } from '~utils/debug';
import { getContext, CONTEXT } from '~context';

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

function* callCallerSaga({
  context,
  identifier,
  methodName,
  params = {},
}: {
  context: 'colony' | 'network',
  identifier?: ENSName,
  methodName: string,
  params?: Object,
}): Saga<*> {
  // TODO typing could be better here, params and return value :-(
  const colonyManager = yield* getContext(CONTEXT.COLONY_MANAGER);
  const caller = yield call(
    [colonyManager, colonyManager.getMethod],
    context,
    methodName,
    identifier,
  );
  return yield call([caller, caller.call], params);
}

/*
 * Gets the caller from the colonyManager and calls it with the given
 * parameters. If no colonyName, network context is assumed.
 */
export const callCaller = (args: {
  context: 'colony' | 'network',
  identifier?: ENSName,
  methodName: string,
  params?: Object,
}) => call(callCallerSaga, args);

export function* executeQuery<C: *, I: *, R: *>(
  context: C,
  query: Query<C, I, R>,
  args: I,
): Saga<R> {
  const { execute } = query(context);
  return yield call(execute, args);
}

export function* executeCommand<C: *, I: *, R: *>(
  context: C,
  createCommand: Command<C, I, R>,
  args: I,
): Saga<R> {
  const { execute } = createCommand(context);
  return yield call(execute, args);
}

export function* validateAndExecuteCommand<C: *, I: *, R: *>(
  context: C,
  createCommand: Command<C, I, R>,
  args: I,
): Saga<R> {
  const { execute, schema } = createCommand(context);
  const maybeSanitizedArgs = schema ? validateSync(schema)(args) : args;
  return yield call(execute, maybeSanitizedArgs);
}
