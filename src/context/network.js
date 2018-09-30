/* @flow */

let networkInstance: Object | void;

const networkContext: Object = {
  instance: networkInstance,
  setInstance: (newNetworkInstance: Object) => {
    networkContext.clearInstance();
    networkContext.instance = newNetworkInstance;
  },
  clearInstance: () => {
    networkContext.instance = undefined;
  },
};

export default networkContext;
