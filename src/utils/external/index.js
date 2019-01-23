/* @flow */
import BN from 'bn.js';
import { fromWei, toWei } from 'ethjs-unit';

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
  balance: BN,
): string => {
  const { div: divResult, mod: modResult } = toWei(
    ethUsdConversionRate,
    'ether',
  ).divmod(toWei(1, 'ether'));
  const wholeBalance = Number(fromWei(balance.mul(divResult), 'ether')) || 0;
  const modBalance = Number(fromWei(balance.mul(modResult), 'ether')) || 0;
  return (wholeBalance + modBalance / 10 ** 18 || wholeBalance).toString();
};

/*
  Request dollar conversion value from etherScan
*/
// eslint-disable-next-line import/prefer-default-export
export const getEthToUsd = (ethValue: BN): Promise<string | void> => {
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
