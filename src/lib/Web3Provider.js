import { providers } from 'ethers';
import Eth from 'ethjs';

class Web3Provider extends providers.Provider {
  constructor() {
    super();
    // https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation
    if (typeof window.web3 == 'undefined' || typeof window.web3.currentProvider == 'undefined') {
      throw new Error('Web3Provider can just be used with a web3 currentProvider injected');
    }
    this.eth = new Eth(window.web3.currentProvider);
  }
  async perform(method, params) {
    switch (method) {
      case 'getGasPrice': {
        const gasPriceBn = await this.eth.gasPrice();
        // Converting to string for now as this is the only format both BN libs understand
        return gasPriceBn.toString();
      }
      case 'getTransactionCount':
        return this.eth.getTransactionCount(params.address, params.blockTag);
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  }
}

export default Web3Provider;
