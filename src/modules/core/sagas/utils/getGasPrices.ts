import { ColonyNetworkClient, Network } from '@colony/colony-js';
import { bigNumberify } from 'ethers/utils';
import { call, put, select } from 'redux-saga/effects';

import { GasPricesProps } from '~immutable/index';
import { ContextModule, TEMP_getContext } from '~context/index';
import { log } from '~utils/debug';
import { DEFAULT_NETWORK } from '~constants';
import { ETH_GAS_STATION, XDAI_GAS_STATION } from '~externalUrls';

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

interface BlockscoutGasStationAPIResponse {
  average: number;
  fast: number;
  slow: number;
}

const DEFAULT_GAS_PRICE = bigNumberify('1000000000');

const fetchGasPrices = async (
  networkClient: ColonyNetworkClient,
): Promise<GasPricesProps> => {
  let networkGasPrice = DEFAULT_GAS_PRICE;

  const defaultGasPrices = {
    timestamp: Date.now(),
    network: networkGasPrice,

    suggested: DEFAULT_GAS_PRICE,
    cheaper: DEFAULT_GAS_PRICE,
    faster: DEFAULT_GAS_PRICE,

    suggestedWait: 60,
    cheaperWait: 60,
    fasterWait: 60,
  };

  try {
    networkGasPrice = await networkClient.provider.getGasPrice();

    let response;

    if (DEFAULT_NETWORK === Network.Mainnet) {
      response = await fetch(ETH_GAS_STATION);
    }
    if (
      DEFAULT_NETWORK === Network.Xdai ||
      DEFAULT_NETWORK === Network.XdaiFork
    ) {
      response = await fetch(XDAI_GAS_STATION);
    }

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (DEFAULT_NETWORK === Network.Mainnet) {
      const data: EthGasStationAPIResponse = await response.json();
      // API prices are in 10Gwei, so they need to be normalised
      const pointOneGwei = bigNumberify(10 ** 8);

      return {
        ...defaultGasPrices,

        suggested: bigNumberify(data.average).mul(pointOneGwei),
        cheaper: bigNumberify(data.safeLow).mul(pointOneGwei),
        faster: bigNumberify(data.fast).mul(pointOneGwei),

        suggestedWait: data.avgWait * 60,
        cheaperWait: data.safeLowWait * 60,
        fasterWait: data.fastWait * 60,
      };
    }

    if (
      DEFAULT_NETWORK === Network.Xdai ||
      DEFAULT_NETWORK === Network.XdaiFork
    ) {
      const data: BlockscoutGasStationAPIResponse = await response.json();
      // API prices are in Gwei, so they need to be normalised
      const oneGwei = bigNumberify(10 ** 9);

      let { average } = data;
      let { fast } = data;
      /*
       * @NOTE IF we're on Gnosis Chain, ensure that transactions alway pay at
       * least 2gwei for gas
       *
       * This to counteract some unpleasantness coming from the Blockscout gas oracle
       *
       * Locally this is not a problem (and we don't even use the oracle to estimate)
       */
      if (
        DEFAULT_NETWORK === Network.Xdai ||
        DEFAULT_NETWORK === Network.XdaiFork
      ) {
        average = data.average > 2 ? data.average : 2;
        fast = data.fast > 2 ? data.fast : 2;
      }
      /*
       * @NOTE Split the values into integer and remainder
       * (1.22 becomes 1 and 22)
       *
       * The integer part gets multiplied by 1 gwei, while the remainder
       * gets padded with 9 zeros. Everything will be added together.
       */
      const [averageInteger, averageRemainder = 0] = String(average).split('.');
      const [slowInteger, slowRemainder = 0] = String(data.slow).split('.');
      const [fastInteger, fastRemainder = 0] = String(fast).split('.');

      return {
        ...defaultGasPrices,

        suggested: bigNumberify(averageInteger)
          .mul(oneGwei)
          .add(String(averageRemainder).padEnd(9, '0')),
        cheaper: bigNumberify(slowInteger)
          .mul(oneGwei)
          .add(String(slowRemainder).padEnd(9, '0')),
        faster: bigNumberify(fastInteger)
          .mul(oneGwei)
          .add(String(fastRemainder).padEnd(9, '0')),
      };
    }

    return defaultGasPrices;
  } catch (caughtError) {
    if (process.env.NODE_ENV !== 'development') {
      log.warn(
        `Could not get ${DEFAULT_NETWORK} network gas prices: ${caughtError.message}`,
      );
    }
    // Default values
    return {
      ...defaultGasPrices,
      timestamp: -Infinity, // Do not cache this
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
