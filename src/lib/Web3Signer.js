import Web3Provider from './Web3Provider';

const ethersTxToWeb3 = (tx, from) => ({
  from,
  to: tx.to,
  value: tx.value ? tx.value.toString() : '0',
  gas: tx.gasLimit.toString(),
  gasPrice: tx.gasPrice.toString(),
  data: tx.data,
  nonce: tx.nonce,
});

class Web3Signer {
  constructor() {
    this.provider = new Web3Provider();
  }
  async getAddress() {
    // https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#raising_hand-account-list-reflects-user-preference
    const accounts = await this.provider.eth.accounts();
    return accounts[0];
  }
  async sign(tx) {
    const from = await this.getAddress();
    const web3Tx = ethersTxToWeb3(tx, from);
    return this.provider.eth.sendTransaction(web3Tx);
  }
}

export default Web3Signer;
