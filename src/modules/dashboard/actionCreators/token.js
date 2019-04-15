/* @flow */

import type { Address } from '~types';

import { ACTIONS } from '~redux';

// eslint-disable-next-line import/prefer-default-export
export const fetchToken = (tokenAddress: Address) => ({
  type: ACTIONS.TOKEN_INFO_FETCH,
  payload: { tokenAddress },
});
