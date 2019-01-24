/* @flow */

// eslint-disable-next-line import/prefer-default-export
export const mergePayload = (
  action: *,
  {
    meta,
    payload,
  }: {
    meta?: Object,
    payload?: Object,
  },
) => ({
  ...action,
  meta: { ...action.meta, ...meta },
  payload: { ...action.payload, ...payload },
});
