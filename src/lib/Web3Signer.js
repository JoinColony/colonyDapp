import Web3Provider from './Web3Provider';

class Web3Signer {
  constructor(web3) {
    this.provider = new Web3Provider(web3);
  }
  getAddress() {
    return this.provider.address;
  }
  async sendTransaction(transaction) {
    return this.provider.sendRawTransaction(transaction);
  }
}

export default Web3Signer;
