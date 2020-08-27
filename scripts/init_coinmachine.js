#!/usr/bin/env node

/*
 * Script to initialize the coin machine extension for a colony
 *
 * The script only requires a colony address (at least v5) and will initialize
 * Coin Machine with sensible defaults. You can adjust these defaults via
 * command line arguments (see below).
 *
 * Usage:
 * Run
 * scripts/init_coinmachine.js
 * from the root dapp directory
 *
 * Arguments:
 *
 * Required:
 * --colony=[COLONY_ADDRESS] # At least v5!!
 *
 * Optional:
 * --walletAddress=[GANACHE_WALLET_ADDRESS] # from ganache-accounts.json
 * # Coin Machine options. See below or here: https://github.com/JoinColony/colonyJS/blob/dd9cc504a2fcb25f2b2dc45855c6dc231a029035/src/contracts/5/CoinMachine.d.ts#L143-L160
 * --purchaseToken
 * --periodLength
 * --windowSize
 * --targetPerPeriod
 * --maxPerPeriod
 * --startingPrice
 */

const args = require('minimist')(process.argv, {
  string: ['colony', 'wallet', 'purchaseToken'],
});

const { getColonyNetworkClient, Network } = require('@colony/colony-js');
const { Wallet } = require('ethers/wallet');
const { JsonRpcProvider } = require('ethers/providers');
const { AddressZero } = require('ethers/constants');

const ganacheAccounts = require('../src/lib/colonyNetwork/ganache-accounts.json');
const etherRouterAbi = require('../src/lib/colonyNetwork/build/contracts/EtherRouter.json');
const coinMachineFactoryAbi = require('../src/lib/colonyNetwork/build/contracts/CoinMachineFactory.json');
const oneTxPaymentFactoryAbi = require('../src/lib/colonyNetwork/build/contracts/OneTxPaymentFactory.json');

if (!args.colony) {
  throw new Error('Please specify a colony address using --colony=[ADDRESS]');
}

const colonyAddress = args.colony;
const walletAddress =
  args.wallet || '0xb77d57f4959eafa0339424b83fcfaf9c15407461';
// The token to receive payments in. Use 0x0 for ether
const purchaseToken = args.purchaseToken || AddressZero;
// How long in seconds each period of the sale should last
const periodLength = args.periodLength || 7 * 24 * 60 * 60;
// Characteristic number of periods that should be used for the moving average. In the long-term, 86% of the weighting will be in this window size. The higher the number, the slower the price will be to adjust
const windowSize = args.windowSize || 2;
// The number of tokens to aim to sell per period
const targetPerPeriod = args.targetPerPeriod || 1000;
// The maximum number of tokens that can be sold per period
const maxPerPeriod = args.maxPerPeriod || 2000;
// The sale price to start at, expressed in units of purchaseToken per token being sold, as a WAD
const startingPrice = args.startingPrice || 2000000;

const privateKey = ganacheAccounts.private_keys[walletAddress];
const etherRouterAddress =
  etherRouterAbi.networks[Object.keys(etherRouterAbi.networks)[0]].address;
const coinMachineFactoryAddress =
  coinMachineFactoryAbi.networks[Object.keys(coinMachineFactoryAbi.networks)[0]]
    .address;
const oneTxPaymentFactoryAddress =
  oneTxPaymentFactoryAbi.networks[
    Object.keys(oneTxPaymentFactoryAbi.networks)[0]
  ].address;

const provider = new JsonRpcProvider();
const wallet = new Wallet(privateKey, provider);

const run = async () => {
  const networkClient = await getColonyNetworkClient(Network.Local, wallet, {
    networkAddress: etherRouterAddress,
    coinMachineFactoryAddress,
    oneTxPaymentFactoryAddress,
  });
  console.log(`Getting Colony with address ${colonyAddress}`);
  const colonyClient = await networkClient.getColonyClient(colonyAddress);
  if (colonyClient.clientVersion < 5) {
    throw new Error('Colony version does not support coin machine');
  }
  console.log('Initializing Coin Machine...');
  await colonyClient.coinMachineClient.initialise(
    purchaseToken,
    periodLength,
    windowSize,
    targetPerPeriod,
    maxPerPeriod,
    startingPrice,
  );
  console.log('Done');
};

run();
