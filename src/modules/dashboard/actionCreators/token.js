/* @flow */

import nanoid from 'nanoid';

import type { Address } from '~types';
import type { Action } from '~redux';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchToken = (
  tokenAddress: Address,
): Action<typeof ACTIONS.TOKEN_INFO_FETCH> => ({
  type: ACTIONS.TOKEN_INFO_FETCH,
  payload: { tokenAddress },
  meta: { id: nanoid(), keyPath: [tokenAddress] },
});
