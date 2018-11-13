/* eslint-disable */

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
): number => +(balance * ethUsdConversionRate).toFixed(2);

/*
  Request dollar conversion value from etherScan
*/
export const getEthToUsd = (ethValue: number) => {
  const ethUsdKey = 'ethUsd';
  const ethUsdTimestampKey = 'ethUsdTimestamp';

  const conversionRateEndpoint =
    'https://api.etherscan.io/api?module=stats&action=ethprice';

  const cachedEthUsd = localStorage.getItem(ethUsdKey) || null;
  if (cachedEthUsd) {
    return Promise.resolve(convertBalanceToUsd(Number(cachedEthUsd), ethValue));
  }

  const cachedEthUsdTimestamp = localStorage.getItem(ethUsdTimestampKey);
  const currentTimestamp = new Date().getTime();
  /*
    Cache exchange rate for one day
  */
  const olderThanOneDay =
    currentTimestamp - Number(cachedEthUsdTimestamp) > 86400000;

  if (!cachedEthUsdTimestamp || olderThanOneDay) {
    return fetch(conversionRateEndpoint)
      .then(response => {
        if (!response.ok) {
          throw Error(`${response.statusText}`);
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

        localStorage.setItem('ethUsdKey', ethUsd);
        localStorage.setItem('ethUsdTimestampKey', currentTimestamp.toString());
        return convertBalanceToUsd(Number(ethUsd), ethValue);
      })
      .catch(console.warn);
  }
};
