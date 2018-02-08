/* eslint-disable import/no-unresolved, flowtype/require-valid-file-annotation */
// This is just a PoC, will be removed later.

import React, { Component } from 'react';
import { Contract, providers, utils, Wallet } from 'ethers';

import { abi } from '../colonyNetwork/build/contracts/ColonyNetwork.json';
import { networks } from '../colonyNetwork/build/contracts/EtherRouter.json';
import { abi as colonyAbi } from '../colonyNetwork/build/contracts/Colony.json';
import { private_keys as accounts } from '../colonyNetwork/test-accounts.json';

// We're dynamically loading this as this is not always needed
// const loadWeb3Signer = async () => {
//   const Web3SignerModule = await import('./lib/Web3Signer');
//   return Web3SignerModule.default;
// };

// Address is from deployed EtherRouter
const etherRouterAddress = networks[Object.keys(networks)[0]].address;

const getSigner = async () => {
  let signer;
  // if (window.web3 && window.web3.currentProvider) {
  // const provider = new providers.Web3Provider(window.web3.currentProvider);
  // signer = provider.getSigner();
  // } else {
  const privKey = `0x${accounts[Object.keys(accounts)[0]]}`;
  // console.log(privKey);
  const provider = new providers.JsonRpcProvider('http://localhost:8546/');
  // This is the wallets private key
  signer = new Wallet(privKey, provider);
  // const bal = await signer.getBalance();
  // console.log(bal);
  // }
  return signer;
};

const createColony = async name => {
  const signer = await getSigner();
  const colonyNetwork = new Contract(etherRouterAddress, abi, signer);

  colonyNetwork.oncolonyadded = idx =>
    console.log(`Colony added: ${idx.toString()}`);

  // let count = await colonyNetwork.getColonyCount();
  // console.log(count.toString());
  const tx = await colonyNetwork.createColony(utils.toUtf8Bytes(name), {
    gasLimit: 4300000,
  });

  // console.log(tx);
  // count = await colonyNetwork.getColonyCount();
  // console.log(count.toString());

  const address = await colonyNetwork.getColony(utils.toUtf8Bytes(name));
  console.log(address);

  const contract = new Contract(address[0], colonyAbi, signer);
  console.log(contract);
  return contract;
};

const recoverColony = async name => {
  const signer = await getSigner();
  const colonyNetwork = new Contract(etherRouterAddress, abi, signer);
  const address = await colonyNetwork.getColony(utils.toUtf8Bytes(name));
  return new Contract(address[0], colonyAbi, signer);
};

const createTask = async (colony, name) => {
  await colony.makeTask(utils.toUtf8Bytes(name));
  const result = await colony.taskCount();
  const taskCount = result[0].toNumber();
  const task = await colony.getTask(taskCount);
  return utils.toUtf8String(task[0]);
};

class ColonyCreationTest extends Component {
  constructor() {
    super();
    this.createColony = this.createColony.bind(this);
    this.recoverColony = this.recoverColony.bind(this);
    this.createTask = this.createTask.bind(this);
  }
  state = { colony: null, tasks: [] };
  async createColony() {
    const { value } = this.colonyName;
    if (!value) return;
    const colony = await createColony(value);
    this.setState({ colony });
    this.colonyName.value = '';
  }
  async recoverColony() {
    const { value } = this.colonyName;
    if (!value) return;
    const colony = await recoverColony(value);
    this.setState({ colony });
    this.colonyName.value = '';
    const result = await colony.taskCount();
    const taskCount = result[0].toNumber();
    const tasks = [];
    for (let i = 1; i <= taskCount; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const task = await colony.getTask(i);
      tasks.push(utils.toUtf8String(task[0]));
    }
    this.setState({ tasks });
  }
  async createTask() {
    const { value } = this.taskName;
    if (!value || !this.state.colony) return;
    const task = await createTask(this.state.colony, value);
    this.setState({
      tasks: [...this.state.tasks, task],
    });
    this.taskName.value = '';
  }
  render() {
    return (
      <div>
        <h1>Create a Colony here</h1>
        <label htmlFor="colonyName">
          Enter colonyName here
          <input
            id="colonyName"
            type="text"
            ref={colonyName => {
              this.colonyName = colonyName;
            }}
          />
        </label>
        <button onClick={this.createColony}>Create colony!</button>
        <button onClick={this.recoverColony}>Recover colony</button>
        {this.state.colony ? (
          <div>
            <strong>YOUR COLONY:</strong>
            <ul>
              <li>Adress: {this.state.colony.address}</li>
            </ul>
            <strong>TASKS:</strong>
            <ul>{this.state.tasks.map(task => <li key={task}>{task}</li>)}</ul>
            <label htmlFor="taskName">
              Task name
              <input
                id="taskName"
                type="text"
                ref={taskName => {
                  this.taskName = taskName;
                }}
              />
            </label>
            <button onClick={this.createTask}>Create task</button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColonyCreationTest;
