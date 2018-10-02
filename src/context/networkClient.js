/* @flow */

import type ColonyNetworkClient from '@colony/colony-js-client';

let networkInstance: ColonyNetworkClient | void;

const networkContext: Object = {
  instance: networkInstance,
  setInstance: (newNetworkInstance: ColonyNetworkClient) => {
    networkContext.clearInstance();
    networkContext.instance = newNetworkInstance;
  },
  clearInstance: () => {
    networkContext.instance = undefined;
  },
};

export default networkContext;
