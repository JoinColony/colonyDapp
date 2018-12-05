/* @flow */

import type { MessageDescriptor } from 'react-intl';

import { call, put, race, take, getContext } from 'redux-saga/effects';

import type { Saga } from 'redux-saga';

import { isDev, log } from '~utils/debug';

import {
  COLONY_CONTEXT,
  NETWORK_CONTEXT,
} from '../../lib/ColonyManager/constants';

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
    if (result.type === errorAction) throw error || new Error(result.payload);
    return result;
  }
  return call(raceErrorGenerator);
};

/**
 * Gets the caller from the colonyManager and calls it with the given
 * parameters. If no colonyIdentifier, network context is assumed.
 */
export const callCaller = ({
  params = {},
  colonyIdentifier,
  methodName,
}: {
  params?: Object,
  colonyIdentifier?: string,
  methodName: string,
}) => {
  function* callCallerGenerator(): Saga<Object> {
    const colonyManager = yield getContext('colonyManager');
    const caller = yield call(colonyManager, colonyManager.getMethod, [
      colonyIdentifier ? COLONY_CONTEXT : NETWORK_CONTEXT,
      methodName,
      colonyIdentifier,
    ]);
    return yield call([caller, caller.call], params);
  }
  return call(callCallerGenerator);
};
