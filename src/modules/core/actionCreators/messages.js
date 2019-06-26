/* @flow */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const messageCancel = (
  id: string,
): Action<typeof ACTIONS.MESSAGE_CANCEL> => ({
  type: ACTIONS.MESSAGE_CANCEL,
  payload: { id },
});
