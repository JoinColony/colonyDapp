/* @flow */

import type { UniqueActionType } from '~redux';

const defaultTransform = action => action;

export type ActionTransformFnType = (
  UniqueActionType<*, *, *>,
) => UniqueActionType<*, *, Object>;

export const withKeyPath = (keyPath: string) => (
  originalTransform?: ActionTransformFnType = defaultTransform,
) => (originalAction: UniqueActionType<*, *, *>) => {
  const action =
    typeof originalTransform == 'function'
      ? originalTransform(originalAction)
      : originalTransform;
  return {
    ...action,
    meta: { ...action.meta, keyPath: [].concat(keyPath) },
  };
};

export const mergePayload = (payload: Object) => (
  originalTransform?: ActionTransformFnType = defaultTransform,
) => (originalAction: UniqueActionType<*, *, *>) => {
  const action =
    typeof originalTransform == 'function'
      ? originalTransform(originalAction)
      : originalTransform;
  return {
    ...action,
    payload: { ...action.payload, ...payload },
  };
};
