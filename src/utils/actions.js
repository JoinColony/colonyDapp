/* @flow */

import type { UniqueActionType } from '~redux';

export type ActionTransformFnType = (
  UniqueActionType<*, *, *>,
) => UniqueActionType<*, *, Object>;

export { default as pipe } from 'lodash/fp/pipe';

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

export const withKey = (key: string) => (
  action: UniqueActionType<*, *, *>,
) => ({
  ...action,
  meta: { ...action.meta, key },
});

export const filterUniqueAction = (id: string, type?: string) => (
  action: Object,
): boolean =>
  action.meta && action.meta.id === id && (type ? action.type === type : true);
