/* eslint-disable import/prefer-default-export */
// @flow

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
  const conversionRateEndpoint =
    'https://api.etherscan.io/api?module=stats&action=ethprice';
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
      return convertBalanceToUsd(Number(ethUsd), ethValue);
    })
    .catch(console.warn);
};
