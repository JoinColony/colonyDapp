/* @flow */

import { createElement } from 'react';
import { render } from 'react-dom';
import { Contract, providers, Wallet } from 'ethers';

import './styles/shared/main.css';
import App from './App.jsx';

import { abi } from '../colonyNetwork/build/contracts/ColonyNetwork.json';
import { networks } from '../colonyNetwork/build/contracts/EtherRouter.json';
import { abi as colonyAbi } from '../colonyNetwork/build/contracts/Colony.json';
import { private_keys as accounts } from '../colonyNetwork/test-accounts.json';

// We're dynamically loading this as this is not always needed
const loadWeb3Signer = async () => {
  const Web3SignerModule = await import('./lib/Web3Signer');
  return Web3SignerModule.default;
};

// Address is from deployed EtherRouter
const etherRouterAddress = networks[Object.keys(networks)[0]].address;
const privKey = `0x${accounts[Object.keys(accounts)[0]]}`;

const provider = new providers.JsonRpcProvider();
// This is the wallets private key
const fundedWallet = new Wallet(privKey, provider);

(async function init() {
  let colonyNetwork;
  // if (window.web3 && window.web3.currentProvider) {
  //   const Web3Signer = await loadWeb3Signer();
  //   colonyNetwork = new Contract(etherRouterAddress, abi, new Web3Signer());
  // } else {
    colonyNetwork = new Contract(etherRouterAddress, abi, fundedWallet);
  // }

  await colonyNetwork.createColony('0x123456', { gasLimit: 4300000 });
  const address = await colonyNetwork.getColony('0x123456');
  const colony = new Contract(address[0], colonyAbi, fundedWallet);
  const version = await colony.version();
  console.log(version[0].toString());
}());

const rootNode = document.getElementById('root');

if (rootNode) {
  render(createElement(App), rootNode);
}
