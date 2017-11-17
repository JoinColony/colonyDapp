import { providers, utils } from 'ethers';
import promisify from 'es6-promisify';

class Web3Provider extends providers.Provider {
  constructor(web3) {
    super();
    // https://github.com/MetaMask/faq/blob/master/detecting_metamask.md#web3-deprecation
    if (typeof web3 == 'undefined' || typeof web3.currentProvider == 'undefined') {
      throw new Error('Web3Provider can just be used with a web3 currentProvider injected');
    }
    this.eth = web3.eth;
    this.currentProvider = web3.currentProvider;
  }
  get address() {
    // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#raising_hand-account-list-reflects-user-preference
    return this.eth.accounts[0];
  }
  prepareTxData(txData) {
    const tx = {
      from: this.address,
    };
    ['to', 'data'].forEach((key) => {
      if (txData[key] != null) {
        tx[key] = txData[key];
      }
    });
    ['gasLimit', 'gasPrice', 'nonce', 'value'].forEach((key) => {
      if (txData[key] != null) {
        tx[key] = utils.hexlify(txData[key]);
      }
    });
    return tx;
  }
  sendRPC(method, params = []) {
    const payload = {
      jsonrpc: '2.0',
      method,
      id: 1,
      params,
    };
    return promisify(this.currentProvider.sendAsync, this.currentProvider)(payload)
      .then(response => response.result);
  }
  async sendRawTransaction(transaction) {
    const gasPrice = await this.getGasPrice();
    const nonce = await this.getTransactionCount(this.address, 'pending');
    const tx = this.prepareTxData({
      ...transaction,
      gasPrice,
      nonce,
    });
    return this.sendRPC('eth_sendTransaction', [tx]);
  }
  async perform(method, params) {
    switch (method) {
      case 'call': {
        const { transaction } = params;
        return this.sendRPC('eth_call', [this.prepareTxData(transaction)]);
      }
      case 'getGasPrice': {
        return this.sendRPC('eth_gasPrice');
      }
      case 'getTransactionCount': {
        return this.sendRPC('eth_getTransactionCount', [utils.hexlify(params.address), params.blockTag]);
      }
      default:
        return Promise.reject(new Error('Not implemented'));
    }
  }
}

export default Web3Provider;
