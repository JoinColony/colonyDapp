/* eslint-disable import/no-unresolved, flowtype/require-valid-file-annotation, react/no-array-index-key */
// This is just a PoC, will be removed later.

import * as React from 'react';
import ethers from 'ethers';

import ContractHttpLoader from '@colony/colony-js-contract-loader-http';
import EthersAdapter from '@colony/colony-js-adapter-ethers';
import ColonyNetworkClient from '@colony/colony-js-client';

window.ethers = ethers;
const { providers, Wallet } = ethers;
const TRUFFLEPIG_URL = 'http://127.0.0.1:3030'; // XXX default pig url

const loader = new ContractHttpLoader({
  endpoint: `${TRUFFLEPIG_URL}/contracts?name=%%NAME%%`,
  parser: 'truffle',
});

const options = {
  gasLimit: ethers.utils.bigNumberify(4300000),
  waitForMining: true,
};

const getNetworkClient = async () => {
  const accountsResponse = await fetch(`${TRUFFLEPIG_URL}/accounts`);
  const accounts = await accountsResponse.json();
  const privateKey = accounts[Object.keys(accounts)[0]];
  const provider = new providers.JsonRpcProvider('http://localhost:8545/'); // XXX default Ganache port
  const wallet = new Wallet(privateKey, provider);
  const adapter = new EthersAdapter({
    loader,
    provider,
    wallet,
  });
  const networkClient = await ColonyNetworkClient.createSelf(adapter);
  console.log('Network Client:', networkClient);
  return networkClient;
};

class ColonyCreationTest extends React.Component {
  state = {
    colonyName: '',
    colonyAddress: null,
    tasks: [],
    tokenAddress: '',
    skillId: null,
    parentSkillId: null,
  };
  networkClient = null;
  colonyClient = null;
  createColony = async () => {
    if (!this.networkClient) this.networkClient = await getNetworkClient();

    const { value: name } = this.colonyName;
    const { value: tokenName } = this.tokenName;
    const { value: tokenSymbol } = this.tokenSymbol;

    const {
      eventData: { colonyId: id } = {},
    } = await this.networkClient.createColony.send(
      { name, tokenName, tokenSymbol, tokenDecimals: 18 },
      options,
    );

    if (id) {
      this.colonyClient = await this.networkClient.getColonyClient({
        id,
      });
      this.setState({
        colonyName: name,
        colonyAddress: this.colonyClient.contract.address,
        tokenAddress: '',
      });
      this.colonyName.value = '';
      this.tokenName.value = '';
      this.tokenSymbol.value = '';
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

    const { address: tokenAddress } = await this.colonyClient.getToken.call();
    this.setState({ tokenAddress });

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
              taskName: ethers.utils.toUtf8String(task.specificationHash),
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
  addSkill = async () => {
    if (!this.colonyClient) return;

    const {
      eventData: { skillId, parentSkillId } = {},
    } = await this.colonyClient.addGlobalSkill.send(
      {
        parentSkillId: 1, // XXX hardcoded, just for testing...
      },
      options,
    );
    this.setState({ skillId, parentSkillId });
  };
  setTaskSkill = async () => {
    if (!this.colonyClient) return;

    const { skillId } = this.state;
    const { value: taskId } = this.taskId;
    if (!(skillId && taskId)) return;

    await this.colonyClient.setTaskSkill.send(
      {
        taskId: parseInt(taskId, 10),
        skillId,
        role: 0,
      },
      options,
    );
    this.taskSkillId.value = '';
  };
  render() {
    return (
      <div>
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
          id="tokenName"
          type="text"
          placeholder="Colony token name"
          ref={tokenName => {
            this.tokenName = tokenName;
          }}
        />
        <input
          id="tokenSymbol"
          type="text"
          placeholder="Colony token symbol"
          ref={tokenSymbol => {
            this.tokenSymbol = tokenSymbol;
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
              <li>Token address: {this.state.tokenAddress}</li>
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
              <button id="addSkill" name="addSkill" onClick={this.addSkill}>
                Add Skill
              </button>
            </div>
            <div>
              SKILL ID: {this.state.skillId}
              <br />
              PARENT SKILL ID: {this.state.parentSkillId}
            </div>
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
            {this.state.tasks.length && (
              <div>
                <label htmlFor="taskSkillId">
                  Task brief
                  <input
                    id="taskSkillId"
                    type="number"
                    ref={taskSkillId => {
                      this.taskSkillId = taskSkillId;
                    }}
                  />
                </label>
                <button onClick={this.setTaskSkill}>Set task brief</button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

export default ColonyCreationTest;
