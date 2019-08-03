/* @flow */

import type { Channel, EventChannel, Saga } from 'redux-saga';

import nanoid from 'nanoid';
import { eventChannel, buffers, END } from 'redux-saga';
import { all, call, put, race, take, select } from 'redux-saga/effects';

import type { ErrorActionType, TakeFilter, Action } from '~redux';
import type { Command, Query, Subscription } from '../../data/types';

import { getContext, CONTEXT } from '~context';
import { validateSync } from '~utils/yup';
import { log } from '~utils/debug';
import { ACTIONS } from '~redux';

/*
 * Effect to take a specific action from a channel.
 */
export const takeFrom = (channel: Channel<*>, type: string) =>
  call(function* takeFromSaga() {
    while (true) {
      const action = yield take(channel);
      if (action.type === type) return action;
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
  log.error(error);
  Object.assign(action.meta, {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
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
  function* raceErrorGenerator(): Saga<void> {
    const result = yield race([take(successAction), take(errorAction)]);
    if (result.type === errorAction) throw error || new Error(result.payload);
    return result;
  }
  return call(raceErrorGenerator);
};

const validateDataSpec = <D, M, A, R>(
  spec: Command<D, M, A, R> | Query<D, M, A, R> | Subscription<D, M, A, R>,
) => {
  if (!spec.context) {
    throw new Error('Cannot prepare, context not defined');
  }

  const allowedContextNames = Object.values(CONTEXT);
  if (
    !(
      spec.context.length > 0 &&
      spec.context.every(contextName =>
        allowedContextNames.includes(contextName),
      )
    )
  ) {
    throw new Error('Cannot prepare, invalid context');
  }

  if (!spec.prepare) {
    throw new Error('Cannot prepare, "prepare" function not defined');
  }

  if (!spec.execute) {
    throw new Error('Cannot execute, "execute" function not defined');
  }

  return true;
};

/*
 * Given a data specification (Command/Query/Subscription)
 * and metadata, validate it and get the dependencies to execute it.
 */
function* getExecuteDependencies<D, M, A, R>(
  spec: Command<D, M, A, R> | Query<D, M, A, R> | Subscription<D, M, A, R>,
  metadata: M,
): Saga<*> {
  validateDataSpec(spec);

  const contextValues = yield all(
    spec.context.map(contextName => call(getContext, contextName)),
  );
  const prepareContext = spec.context.reduce(
    (contextObj, contextName, index) => ({
      ...contextObj,
      [contextName]: contextValues[index],
    }),
    {},
  );

  return yield call(spec.prepare, prepareContext, metadata);
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
  const startQuery = Date.now();

  const executeDeps = yield call(getExecuteDependencies, query, {
    // The metadata object is cloned to satisfy flow.
    ...metadata,
  });

  const result = yield call(query.execute, executeDeps, { ...args });

  log.verbose(
    `Executed query "${query.name}" in ${Date.now() - startQuery} ms`,
    result,
  );
  return result;
}

export function* executeSubscription<D, M, A, R>(
  subscriber: Subscription<D, M, A, R>,
  {
    args,
    metadata,
  }: {
    args?: A,
    metadata: M,
  },
): Saga<EventChannel<R | typeof END>> {
  log.verbose(`Starting subscription "${subscriber.name}"`, {
    args,
    metadata,
  });

  const executeDeps = yield call(getExecuteDependencies, subscriber, {
    // The metadata object is cloned to satisfy flow.
    ...metadata,
  });

  const subscription = yield call(
    [subscriber, subscriber.execute],
    executeDeps,
    args,
  );

  return eventChannel(emitter => {
    let subs = [];
    try {
      subs = subscription(emitter);
    } catch (caughtError) {
      emitter(END);
      throw caughtError;
    }

    return () => {
      log.verbose(`Stopping subscription "${subscription.name}"`, {
        args,
        metadata,
      });
      subs.forEach(({ stop }) => stop());
    };
  }, buffers.expanding());
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
  const startCommand = Date.now();

  // The args and metadata objects are cloned to satisfy flow.
  const maybeSanitizedArgs = {
    ...(command.schema ? validateSync(command.schema)(args) : args),
  };
  const executeDeps = yield call(getExecuteDependencies, command, {
    ...metadata,
  });

  const result = yield call(command.execute, executeDeps, maybeSanitizedArgs);

  log.verbose(
    `Executed command "${command.name}" in ${Date.now() - startCommand} ms`,
    result,
  );
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

/*
 * Effect (actually more of a helper) to put a Notification action
 */
export const putNotification = (payload?: *, meta?: Object = {}) => {
  try {
    const notificationAction: Action<typeof ACTIONS.INBOX_ITEMS_ADD_SUCCESS> = {
      type: ACTIONS.INBOX_ITEMS_ADD_SUCCESS,
      payload: {
        activity: {
          id: nanoid(),
          timestamp: new Date(),
          ...payload,
        },
      },
      meta: {
        ...meta,
      },
    };
    return put(notificationAction);
  } catch (caughtError) {
    return putError(ACTIONS.INBOX_ITEMS_ADD_ERROR, caughtError, meta);
  }
};
