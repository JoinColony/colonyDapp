/* @flow */
/* eslint-disable import/prefer-default-export */

import type { NetworkActionTypes } from '~redux/types/actions/network';

import { ACTIONS } from '~redux';

export const fetchNetworkVersion = (): NetworkActionTypes.NETWORK_FETCH_VERSION => ({
  type: ACTIONS.NETWORK_FETCH_VERSION,
});

export const updateNetworkVersion = (version: string) => ({
  type: ACTIONS.NETWORK_VERSION_UPDATE,
  payload: {
    version,
  },
});
