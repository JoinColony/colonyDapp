import localforage from 'localforage';

import { Action, ActionTypes } from '~redux/index';

type Next = (arg0: Action<any>) => any;

const persistMiddleware = (store: any) => (next: Next) => (
  action: Action<any>,
) => {
  if (action.type === ActionTypes.REHYDRATE) {
    const {
      payload: { key },
    } = action;
    localforage
      .getItem(`redux:persist:${key}`)
      .then((item: any) => {
        if (!item) return;
        const parsed = JSON.parse(item);
        store.dispatch({
          type: ActionTypes.REHYDRATED,
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
