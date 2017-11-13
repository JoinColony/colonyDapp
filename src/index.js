/* @flow */

import { createElement } from 'react';
import { render } from 'react-dom';
import { Contract, providers, Wallet } from 'ethers';

import './styles/shared/main.css';
import App from './App.jsx';

import { abi } from '../colonyNetwork/build/contracts/ColonyNetwork.json';
import { networks } from '../colonyNetwork/build/contracts/EtherRouter.json';

// We're dynamically loading this as this is not always needed
const loadWeb3Signer = async () => {
  const Web3SignerModule = await import('./lib/Web3Signer');
  return Web3SignerModule.default;
};

// Address is from deployed EtherRouter
const etherRouterAddress = networks[Object.keys(networks)[0]].address;
const provider = new providers.JsonRpcProvider();
// This is the wallets private key
const fundedWallet = new Wallet('0x7231a774a538fce22a329729b03087de4cb4a1119494db1c10eae3bb491823e7', provider);

(async function init() {
  let colonyNetwork;
  if (window.web3 && window.web3.currentProvider) {
    const Web3Signer = await loadWeb3Signer();
    colonyNetwork = new Contract(etherRouterAddress, abi, new Web3Signer());
  } else {
    colonyNetwork = new Contract(etherRouterAddress, abi, fundedWallet);
  }
  await colonyNetwork.createColony('0x123456');
  // const address = await colonyNetwork.functions.getColony('coolony');
  // console.log(address);
}());

const rootNode = document.getElementById('root');

if (rootNode) {
  render(createElement(App), rootNode);
}
