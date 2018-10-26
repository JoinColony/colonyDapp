/* @flow */

import { call } from 'redux-saga/effects';

/*
 * Effect to create a new class instance of Class (use instead of "new Class")
 */
// eslint-disable-next-line import/prefer-default-export
export const create = (Class: Function, ...args: any[]) =>
  call(() => new Class(...args));
