/* @flow */
/* eslint-disable import/prefer-default-export */

import type { Action } from '~redux';

import { ACTIONS } from '~redux';

export const fetchNetworkVersion = (): Action<
  typeof ACTIONS.NETWORK_FETCH_VERSION,
> => ({
  type: ACTIONS.NETWORK_FETCH_VERSION,
});
