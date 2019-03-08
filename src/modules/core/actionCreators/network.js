/* @flow */
/* eslint-disable import/prefer-default-export */

import { ACTIONS } from '~redux';

export const updateNetworkVersion = (version: string) => ({
  type: ACTIONS.NETWORK_VERSION_UPDATE,
  payload: {
    version,
  },
});
