/* @flow */

export const REHYDRATE = '@@persist/REHYDRATE';
export const REHYDRATED = '@@persist/REHYDRATED';

export const rehydrate = (key: string) => ({
  type: REHYDRATE,
  payload: { key },
});
