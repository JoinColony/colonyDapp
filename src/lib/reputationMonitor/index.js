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

let lastBlockThisServiceMined = null;
let reputationMonitorActive = false;

async function forwardTime(seconds) {
  await provider.send('evm_increaseTime', [seconds]);
  await provider.send('evm_mine');
}

async function doBlockChecks(blockNumber) {
  // Don't mine two blocks in a row
  if (lastBlockThisServiceMined >= blockNumber) { return; }
  if (!reputationMonitorActive) { return; }

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
    lastBlockThisServiceMined = blockNumber + 1;
    return;
  }
  // If the active log length is anything other than 0, mine a block
  const activeCycleAddress = await colonyNetwork.getReputationMiningCycle(true);
  const activeMiningCycle = new ethers.Contract(
    activeCycleAddress,
    cycleAbi,
    provider,
  );
  logLength = await activeMiningCycle.getReputationUpdateLogLength();
  if (!logLength.eq(1)) {
    await forwardTime(86401);
    lastBlockThisServiceMined = blockNumber + 1;
    return;
  }

  // Has the miner submitted? If so, mine a block
  const nSubmitted = await activeMiningCycle.getNUniqueSubmittedHashes();
  if (nSubmitted.eq(1)) {
    await forwardTime(86401);
    lastBlockThisServiceMined = blockNumber + 1;
  }
}

provider.on('block', doBlockChecks);

// Also proxy oracle reqeusts from 127.0.0.1:3001/reputation/local to the oracle
// to accommodate differences between dev and production

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/reputation/local', createProxyMiddleware({ target: 'http://127.0.0.1:3002/', changeOrigin: true, pathRewrite: {'^/reputation/local' : ''}}));
app.get('/reputation/monitor/toggle', function (req, res) {
  reputationMonitorActive = !reputationMonitorActive;
  res.send(`Reputation monitor auto mining is now ${reputationMonitorActive ? "on" : "off" }`)
});
app.get('/reputation/monitor/status', function (req, res) {
  res.send(`{state: ${reputationMonitorActive}}`);
});
app.listen(3001);
