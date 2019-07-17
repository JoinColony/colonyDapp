/* @flow */

import type { ColonyNetworkClient } from '@colony/colony-js-client';
import type { Saga } from 'redux-saga';

import BigNumber from 'bn.js';

import { call, put, select } from 'redux-saga/effects';

import type { GasPricesProps } from '~immutable';

import { CONTEXT, getContext } from '~context';
import { log } from '~utils/debug';
import { gasPrices as gasPricesSelector } from '../../selectors';
import { updateGasPrices } from '../../actionCreators';

type EthGasStationAPIResponse = {
  average: number,
  avgWait: number,
  block_time: number,
  blockNum: number,
  fast: number,
  fastest: number,
  fastWait: number,
  fastestWait: number,
  safeLow: number,
  safeLowWait: number,
  speed: number,
};

const ETH_GAS_STATION_ENDPOINT =
  'https://ethgasstation.info/json/ethgasAPI.json';
const DEFAULT_GAS_PRICE = '1';

const getNetworkGasPrice = async (
  networkClient: ColonyNetworkClient,
): Promise<string> => {
  const price: BigNumber = await networkClient.adapter.provider.getGasPrice();
  // Handling the weird ethers BN implementation. Remove when web3
  return price.toString();
};

const fetchGasPrices = async (
  networkClient: ColonyNetworkClient,
): Promise<GasPricesProps> => {
  let networkGasPrice = DEFAULT_GAS_PRICE;

  try {
    networkGasPrice = await getNetworkGasPrice(networkClient);

    const response = await fetch(ETH_GAS_STATION_ENDPOINT);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data: EthGasStationAPIResponse = await response.json();

    // API prices are in 10Gwei, so they need to be normalised
    const pointOneGwei = new BigNumber(10 ** 8);

    return {
      timestamp: Date.now(),
      network: new BigNumber(networkGasPrice),

      suggested: new BigNumber(data.average).mul(pointOneGwei),
      cheaper: new BigNumber(data.safeLow).mul(pointOneGwei),
      faster: new BigNumber(data.fast).mul(pointOneGwei),

      suggestedWait: data.avgWait * 60,
      cheaperWait: data.safeLowWait * 60,
      fasterWait: data.fastWait * 60,
    };
  } catch (caughtError) {
    log.warn(`Could not get ETH gas prices: ${caughtError.message}`);
    // Default values
    return {
      timestamp: -Infinity, // Do not cache this
      suggested: new BigNumber(networkGasPrice),
    };
  }
};

export default function* getGasPrices(): Saga<GasPricesProps> {
  const cachedPrices = yield select(gasPricesSelector);

  if (Date.now() - cachedPrices.timestamp < 15 * 60 * 1000) {
    return cachedPrices;
  }

  const { networkClient } = yield* getContext(CONTEXT.COLONY_MANAGER);

  const gasPrices = yield call(fetchGasPrices, networkClient);

  yield put(updateGasPrices(gasPrices));

  return gasPrices;
}
