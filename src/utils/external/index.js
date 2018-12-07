/* @flow */
import BN from 'bn.js';

const DEFAULT_GAS_LIMIT = new BN(21001);

type EstimatedGasCostAPIResponse = {
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

export type EstimatedGasCost = {
  cheaper: BN,
  cheaperWait: number,
  faster: BN,
  fasterWait: number,
  suggested: BN,
  suggestedWait: number,
};

/*
 * Get estimated gas costs in Gwei
 */
export const getEstimatedGasCost = (
  gasLimit: BN = DEFAULT_GAS_LIMIT,
): Promise<EstimatedGasCost | void> => {
  const ESTIMATED_GAS_COST_KEY = 'estimatedGasCost';
  const ESTIMATED_GAS_COST_TIMESTAMP_KEY = 'estimatedGasCostTimestamp';

  const estimatedGasCostEndpoint =
    'https://ethgasstation.info/json/ethgasAPI.json';

  const cachedGasCost = localStorage.getItem(ESTIMATED_GAS_COST_KEY) || null;
  const cachedGasCostTimestamp =
    localStorage.getItem(ESTIMATED_GAS_COST_TIMESTAMP_KEY) || null;
  const currentTimestamp = new Date().getTime();

  if (cachedGasCost && cachedGasCostTimestamp) {
    /*
     * Cache for 15 minutes
     */
    const isCacheExpired =
      currentTimestamp - Number(cachedGasCostTimestamp) > 900000;
    if (!isCacheExpired) {
      const parsedGasCosts = JSON.parse(cachedGasCost);
      const { cheaper, faster, suggested } = parsedGasCosts;
      const bnFormattedCosts = {
        ...parsedGasCosts,
        cheaper: new BN(cheaper),
        faster: new BN(faster),
        suggested: new BN(suggested),
      };
      return Promise.resolve(bnFormattedCosts);
    }
  }
  return fetch(estimatedGasCostEndpoint)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(
      ({
        average: suggested10Gwei,
        avgWait,
        fast: faster10Gwei,
        fastWait,
        safeLow: cheaper10Gwei,
        safeLowWait,
      }: EstimatedGasCostAPIResponse) => {
        /*
         * For some reason, this API returns gas cost in units
         * 10 Gwei. So we need to divide by 10 to get to 1 Gwei
         */
        const suggested = new BN(suggested10Gwei / 10).mul(gasLimit);
        const cheaper = new BN(cheaper10Gwei / 10).mul(gasLimit);
        const faster = new BN(faster10Gwei / 10).mul(gasLimit);
        const cheaperWait = Math.ceil(safeLowWait * 60);
        const fasterWait = Math.ceil(fastWait * 60);
        const suggestedWait = Math.ceil(avgWait * 60);

        const estimatedCosts = {
          cheaper,
          cheaperWait,
          faster,
          fasterWait,
          suggested,
          suggestedWait,
        };

        localStorage.setItem(
          ESTIMATED_GAS_COST_KEY,
          JSON.stringify(estimatedCosts),
        );
        localStorage.setItem(
          ESTIMATED_GAS_COST_TIMESTAMP_KEY,
          currentTimestamp.toString(),
        );
        return estimatedCosts;
      },
    )
    .catch(console.warn);
};

type EthUsdResponse = {
  status: string,
  message: string,
  result: {
    ethbtc: string,
    ethbtc_timestamp: string,
    ethusd: string,
    ethusd_timestamp: string,
  },
};

const convertBalanceToUsd = (
  ethUsdConversionRate: number,
  balance: number,
): number => balance * ethUsdConversionRate || 0;

/*
  Request dollar conversion value from etherScan
*/
export const getEthToUsd = (ethValue: number): Promise<number | void> => {
  const ETH_USD_KEY = 'ethUsd';
  const ETH_USD_TIMESTAMP_KEY = 'ethUsdTimestamp';

  const conversionRateEndpoint =
    'https://api.etherscan.io/api?module=stats&action=ethprice';

  const cachedEthUsd = localStorage.getItem(ETH_USD_KEY) || null;
  const cachedEthUsdTimestamp =
    localStorage.getItem(ETH_USD_TIMESTAMP_KEY) || null;
  const currentTimestamp = new Date().getTime();

  if (cachedEthUsd && cachedEthUsdTimestamp) {
    /*
      Cache exchange rate for one day
    */
    const olderThanOneDay =
      currentTimestamp - Number(cachedEthUsdTimestamp) > 86400000;
    if (!olderThanOneDay) {
      return Promise.resolve(
        convertBalanceToUsd(Number(cachedEthUsd), ethValue),
      );
    }
  }

  return fetch(conversionRateEndpoint)
    .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((response: EthUsdResponse) => {
      const {
        result: { ethusd: ethUsd },
        status,
      } = response;
      if (status !== '1') {
        throw Error(`Invalid response data for getEthToUsd().`);
      }

      localStorage.setItem(ETH_USD_KEY, ethUsd);
      localStorage.setItem(ETH_USD_TIMESTAMP_KEY, currentTimestamp.toString());
      return convertBalanceToUsd(Number(ethUsd), ethValue);
    })
    .catch(console.warn);
};
