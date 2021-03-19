const ethers = require('ethers'); // eslint-disable-line @typescript-eslint/no-var-requires

const colonyNetworkAddress = process.argv[2];

const provider = new ethers.providers.JsonRpcProvider(`http://localhost:8545`);

// eslint-disable-next-line max-len
const networkAbi = require('../colonyNetwork/build/contracts/IColonyNetwork.json')
  .abi;
// eslint-disable-next-line max-len
const cycleAbi = require('../colonyNetwork/build/contracts/IReputationMiningCycle.json')
  .abi;

const colonyNetwork = new ethers.Contract(
  colonyNetworkAddress,
  networkAbi,
  provider,
);

async function forwardTime(seconds) {
  await provider.send('evm_increaseTime', [seconds]);
  await provider.send('evm_mine');
}

async function doBlockChecks() {
  // Inactive log length greater than one, mine a block
  const inactiveCycleAddress = await colonyNetwork.getReputationMiningCycle(
    false,
  );
  const inactiveMiningCycle = new ethers.Contract(
    inactiveCycleAddress,
    cycleAbi,
    provider,
  );
  let logLength = await inactiveMiningCycle.getReputationUpdateLogLength();
  if (logLength.gt(1)) {
    await forwardTime(86401);
    return;
  }
  // If the active log length is greater than one, mine a block
  const activeCycleAddress = await colonyNetwork.getReputationMiningCycle(true);
  const activeMiningCycle = new ethers.Contract(
    activeCycleAddress,
    cycleAbi,
    provider,
  );
  logLength = await activeMiningCycle.getReputationUpdateLogLength();
  if (logLength.gt(1)) {
    await forwardTime(86401);
    return;
  }

  // Has the miner submitted? If so, mine a block
  const nSubmitted = await activeMiningCycle.getNUniqueSubmittedHashes();
  if (nSubmitted.eq(1)) {
    await forwardTime(86401);
  }
}

provider.on('block', doBlockChecks);
