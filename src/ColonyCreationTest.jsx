/* eslint-disable import/no-unresolved, flowtype/require-valid-file-annotation, react/no-array-index-key, no-alert */
// This is just a PoC, will be removed later.

import * as React from 'react';
import { bigNumberify, toUtf8String } from 'ethers/utils';

/*
 * Eslint apparently doesn't play well with webpack aliases that contain the `@` sign
 * Everything else works just fine.
 *
 * When ever we whant to get rid of this disable, we can just change it to:
 * `colony/colony-js-client` or `~colony/colony-js-client`
 */
/* eslint-disable import/no-extraneous-dependencies */
import ContractHttpLoader from '@colony/colony-js-contract-loader-http';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import ColonyNetworkClient from '@colony/colony-js-client';

import { software as wallet } from 'colony-wallet/wallets';
import { localhost } from 'colony-wallet/providers';

const TRUFFLEPIG_URL = 'http://127.0.0.1:3030'; // XXX default pig url
const RPC_URL = 'http://localhost:8545/'; // XXX default Ganache port

const loader = new ContractHttpLoader({
  endpoint: `${TRUFFLEPIG_URL}/contracts?name=%%NAME%%`,
  parser: 'truffle',
});

const options = {
  gasLimit: bigNumberify(4300000),
  waitForMining: true,
};

const getNetworkId = async rpcUrl => {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    body: JSON.stringify({
      method: 'net_version',
    }),
  });
  const netVersion = await response.json();
  return netVersion.result;
};

const getPrivateKey = async () => {
  const response = await fetch(`${TRUFFLEPIG_URL}/accounts`);
  const accounts = await response.json();
  return accounts[Object.keys(accounts)[0]];
};

const getNetworkClient = async () => {
  const provider = localhost(RPC_URL);
  const networkId = await getNetworkId(RPC_URL);
  const privateKey = await getPrivateKey();
  const clientWallet = await wallet.open({
    privateKey,
    provider,
  });
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet: clientWallet,
  });
  const networkClient = await ColonyNetworkClient.createSelf(adapter, {
    networkId,
  });
  console.log('Network Client:', networkClient);
  return networkClient;
};

class ColonyCreationTest extends React.Component {
  state = {
    colonyAddress: null,
    colonyName: '',
    colonyTokenAddress: '',
    createdTokenAddress: '',
    tasks: [],
  };
  networkClient = null;
  colonyClient = null;
  createToken = async () => {
    if (!this.networkClient) this.networkClient = await getNetworkClient();

    const { value: name } = this.tokenName;
    const { value: symbol } = this.tokenSymbol;
    const createdTokenAddress = await this.networkClient.createToken({
      name,
      symbol,
    });
    this.setState({ createdTokenAddress });
  };
  createColony = async () => {
    if (!this.networkClient) this.networkClient = await getNetworkClient();

    const { value: name } = this.colonyName;
    const { value: tokenAddress } = this.tokenAddress;

    const {
      eventData: { colonyId: id } = {},
    } = await this.networkClient.createColony.send(
      { name, tokenAddress },
      options,
    );

    if (id) {
      this.colonyClient = await this.networkClient.getColonyClient({
        id,
      });
      this.setState({
        colonyName: name,
        colonyAddress: this.colonyClient.contract.address,
        colonyTokenAddress: '',
      });
      this.colonyName.value = '';
      this.tokenAddress.value = '';
    }
  };
  recoverColony = async () => {
    if (!this.networkClient) this.networkClient = await getNetworkClient();

    const { value: key } = this.colonyName;
    if (!key) return;

    this.colonyClient = await this.networkClient.getColonyClient({ key });
    console.log('Colony Client:', this.colonyClient);

    this.setState({
      colonyName: key,
      colonyAddress: this.colonyClient.contract.address,
    });
    this.colonyName.value = '';

    const {
      address: colonyTokenAddress,
    } = await this.colonyClient.getToken.call();
    this.setState({ colonyTokenAddress });

    const { count: taskCount } = await this.colonyClient.getTaskCount.call();
    const taskIds = Array(...{ length: taskCount }).map((_, i) => i + 1);
    const tasks = await Promise.all(
      taskIds.map(
        taskId =>
          new Promise(async (resolve, reject) => {
            const task = await this.colonyClient.getTask.call({ taskId });
            if (!task) reject(new Error(`Task with id ${taskId} not found`));
            resolve({
              taskId,
              taskName: toUtf8String(task.specificationHash),
            });
          }),
      ),
    );
    this.setState({ tasks });
  };
  createTask = async () => {
    if (!this.colonyClient) return;

    const { value: taskName } = this.taskName;
    if (!taskName) return;

    const {
      eventData: { taskId } = {},
    } = await this.colonyClient.createTask.send(
      {
        specificationHash: taskName,
        domainId: 1,
      },
      options,
    );
    this.taskName.value = '';
    this.setState({ tasks: [...this.state.tasks, { taskId, taskName }] });
  };
  render() {
    return (
      <div>
        <div>
          <h1>Create a token</h1>
          <input
            id="tokenName"
            type="text"
            placeholder="Token name"
            ref={tokenName => {
              this.tokenName = tokenName;
            }}
          />
          <input
            id="tokenSymbol"
            type="text"
            placeholder="Token symbol"
            ref={tokenSymbol => {
              this.tokenSymbol = tokenSymbol;
            }}
          />
          <button onClick={this.createToken}>Create token</button>
          <div>{this.state.createdTokenAddress}</div>
        </div>
        <h1>Create a Colony here</h1>
        <input
          id="colonyName"
          type="text"
          placeholder="Colony name"
          ref={colonyName => {
            this.colonyName = colonyName;
          }}
        />
        <input
          id="tokenAddress"
          type="text"
          placeholder="Token address"
          ref={tokenAddress => {
            this.tokenAddress = tokenAddress;
          }}
        />
        <button onClick={this.createColony}>Create colony</button>
        <button onClick={this.recoverColony}>Recover colony</button>
        {this.state.colonyAddress ? (
          <div>
            <strong>YOUR COLONY:</strong>
            <ul>
              <li>Address: {this.state.colonyAddress}</li>
              <li>Name: {this.state.colonyName}</li>
              <li>Token address: {this.state.colonyTokenAddress}</li>
            </ul>
            <strong>TASKS:</strong>
            <ul>
              {this.state.tasks.map(({ taskId, taskName }, key) => (
                <li key={key}>
                  {taskName} (ID: {taskId})
                </li>
              ))}
            </ul>
            <div>
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
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColonyCreationTest;
