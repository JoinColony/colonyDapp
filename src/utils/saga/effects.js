/* @flow */

import type { MessageDescriptor } from 'react-intl';

import { call, put } from 'redux-saga/effects';

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
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
    action.payload.meta = {
      message: error.message,
      stack: error.stack,
    };
  }
  return put(action);
};
