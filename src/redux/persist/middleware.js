/* @flow */

import localforage from 'localforage';

import type { Action } from '~redux';

import { REHYDRATE, REHYDRATED } from './actions';

type Next = (Action<*>) => any;

const persistMiddleware = (store: any) => (next: Next) => (
  action: Action<*>,
) => {
  if (action.type === REHYDRATE) {
    const {
      payload: { key },
    } = action;
    localforage
      .getItem(`redux:persist:${key}`)
      .then(item => {
        if (!item) return;
        const parsed = JSON.parse(item);
        store.dispatch({
          type: REHYDRATED,
          payload: parsed,
        });
      })
      .catch(e => {
        console.warn(
          `Could not rehydrate item with key ${key}. Error: ${e.message}`,
        );
      });
  }
  return next(action);
};

export default persistMiddleware;
