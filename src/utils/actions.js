/* @flow */

import type { UniqueActionType } from '~redux';

export type ActionTransformFnType = (
  UniqueActionType<*, *, *>,
) => UniqueActionType<*, *, Object>;

export { default as compose } from 'lodash/fp/compose';

export const mergePayload = (payload: Object) => (
  action: UniqueActionType<*, *, *>,
) => ({
  ...action,
  payload: { ...action.payload, ...payload },
});

export const mapPayload = (mapFn: any => any) => (
  action: UniqueActionType<*, *, *>,
) => ({
  ...action,
  payload: mapFn(action.payload),
});

export const withKeyPath = (keyPath: string) => (
  action: UniqueActionType<*, *, *>,
) => ({
  ...action,
  meta: { ...action.meta, keyPath: [].concat(keyPath) },
});
