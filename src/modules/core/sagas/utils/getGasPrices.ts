import { NetworkClient } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { call, put, select } from 'redux-saga/effects';

import { GasPricesProps } from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { log } from '~utils/debug';

import { gasPrices as gasPricesSelector } from '../../selectors';
import { updateGasPrices } from '../../actionCreators';

interface EthGasStationAPIResponse {
  average: number;
  avgWait: number;
  // eslint-disable-next-line camelcase
  block_time: number;
  blockNum: number;
  fast: number;
  fastest: number;
  fastWait: number;
  fastestWait: number;
  safeLow: number;
  safeLowWait: number;
  speed: number;
}

const ETH_GAS_STATION_ENDPOINT =
  'https://ethgasstation.info/json/ethgasAPI.json';
const DEFAULT_GAS_PRICE = '1';

const getNetworkGasPrice = async (
  networkClient: NetworkClient,
): Promise<string> => {
  const price = await networkClient.provider.getGasPrice();
  // Handling the weird ethers BN implementation
  // FIXME maybe leave it wehn moving to ethers BN
  return price.toString();
};

const fetchGasPrices = async (
  networkClient: NetworkClient,
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
    const pointOneGwei = bigNumberify(10 ** 8);

    return {
      timestamp: Date.now(),
      network: bigNumberify(networkGasPrice),

      suggested: bigNumberify(data.average).mul(pointOneGwei),
      cheaper: bigNumberify(data.safeLow).mul(pointOneGwei),
      faster: bigNumberify(data.fast).mul(pointOneGwei),

      suggestedWait: data.avgWait * 60,
      cheaperWait: data.safeLowWait * 60,
      fasterWait: data.fastWait * 60,
    };
  } catch (caughtError) {
    log.warn(`Could not get ETH gas prices: ${caughtError.message}`);
    // Default values
    return {
      timestamp: -Infinity, // Do not cache this
      suggested: bigNumberify(networkGasPrice),
    };
  }
};

export default function* getGasPrices() {
  const cachedPrices = yield select(gasPricesSelector);

  if (Date.now() - cachedPrices.timestamp < 15 * 60 * 1000) {
    return cachedPrices;
  }

  const { networkClient } = TEMP_getContext(ContextModule.ColonyManager);

  const gasPrices: GasPricesProps = yield call(fetchGasPrices, networkClient);

  yield put(updateGasPrices(gasPrices));

  return gasPrices;
}
