/* @flow */

import type { MessageDescriptor } from 'react-intl';

import { call, put, race, take } from 'redux-saga/effects';

import { isDev, log } from '~utils/debug';

import type { Saga } from 'redux-saga';

/*
 * Effect to create a new class instance of Class (use instead of "new Class")
 */
export const create = (Class: Function, ...args: any[]) =>
  call(() => new Class(...args));

/*
 * Effect to put a consistent error action
 */
export const putError = (
  type: string,
  error: Error,
  msg?: MessageDescriptor | string,
) => {
  const action = {
    type,
    payload: {
      error: msg || { id: `sagaError.${type}` },
      meta: {},
    },
  };
  if (isDev) {
    log(error);
    action.payload.meta = {
      message: error.message,
      stack: error.stack,
    };
  }
  return put(action);
};

/**
 * Races the `take` of two actions, one success and one error. If success is
 * first, function returns. If error is first, function throws.
 */
export const raceError = (
  successAction: string,
  errorAction: string,
  error?: Error,
) => {
  function* raceErrorGenerator(): Saga<void> {
    const result = yield race([take(successAction), take(errorAction)]);
    if (result.type === error) throw error || new Error(result.error);
  }
  return call(raceErrorGenerator);
};
