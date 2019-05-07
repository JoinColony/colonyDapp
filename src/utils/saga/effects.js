/* @flow */

import type { Channel, Saga } from 'redux-saga';

import { all, call, put, race, take, select } from 'redux-saga/effects';

import type { ErrorActionType, TakeFilter } from '~redux';
import type { Command, Query } from '../../data/types';

import { getContext, CONTEXT } from '~context';
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
    log.error(error);
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

function* executeCommandOrQuery<D, M, A, R>(
  commandOrQuery: Command<D, M, A, R> | Query<D, M, A, R>,
  {
    args,
    metadata,
  }: {
    args: A,
    metadata: M,
  },
): Saga<R> {
  const { context, execute, prepare } = commandOrQuery;

  /*
   * Validate the command or query object
   */
  if (!context) {
    throw new Error('Cannot execute, context not defined');
  }
  const allowedContextNames = Object.values(CONTEXT);
  if (
    !(
      context.length > 0 &&
      context.every(contextName => allowedContextNames.includes(contextName))
    )
  ) {
    throw new Error('Cannot execute, invalid context');
  }
  if (!execute) {
    throw new Error('Cannot execute, "execute" function not defined');
  }
  if (!prepare) {
    throw new Error('Cannot execute, "prepare" function not defined');
  }

  /*
   * Create a context object for the `prepare` step.
   */
  const contextValues = yield all(
    context.map(contextName => call(getContext, contextName)),
  );
  const prepareContext = context.reduce(
    (contextObj, contextName, index) => ({
      ...contextObj,
      [contextName]: contextValues[index],
    }),
    {},
  );

  /*
   * Call the `prepare` step to get the `execute` dependencies.
   */
  const executeDeps = yield call(prepare, prepareContext, metadata);

  /*
   * Call and return the `execute` step with the dependencies and given args.
   */
  return yield call(execute, executeDeps, args);
}

export function* executeQuery<D, M, A, R>(
  query: Query<D, M, A, R>,
  {
    args,
    metadata,
  }: {
    args?: A,
    metadata?: M,
  },
): Saga<R> {
  log.verbose(`Executing query "${query.name}"`, { args, metadata });
  const result = yield call(executeCommandOrQuery, query, {
    // Destructure the objects; either prop is optional, but for flow,
    // they need to be defined to call the inner function.
    args: { ...args },
    metadata: { ...metadata },
  });
  log.verbose(`Executed query "${query.name}"`, result);
  return result;
}

export function* executeCommand<D, M, A, R>(
  command: Command<D, M, A, R>,
  {
    args,
    metadata,
  }: {|
    args?: A,
    metadata?: M,
  |},
): Saga<R> {
  log.verbose(`Executing command "${command.name}"`, { args, metadata });
  const maybeSanitizedArgs = command.schema
    ? validateSync(command.schema)(args)
    : args;
  const result = yield call(executeCommandOrQuery, command, {
    // Destructure the objects; either prop is optional, but for flow,
    // they need to be defined to call the inner function.
    args: { ...maybeSanitizedArgs },
    metadata: { ...metadata },
  });
  log.verbose(`Executed command "${command.name}"`, result);
  return result;
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
