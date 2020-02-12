import BN from 'bn.js';
import { fromWei } from 'ethjs-unit';

import { DEFAULT_NETWORK } from '~constants';

interface EthUsdResponse {
  status: string;
  message: string;
  result: {
    ethbtc: string;
    /* eslint-disable camelcase */
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
    /* eslint-enable camelcase */
  };
}

interface EtherscanLinkProps {
  network?: string;
  linkType?: 'address' | 'tx' | 'token';
  addressOrHash: string;
}

/*
  Request dollar conversion value from etherScan
*/
export const getEthToUsd = (ethValue: BN): Promise<number | void> => {
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
      currentTimestamp - parseInt(cachedEthUsdTimestamp, 10) > 86400000;
    if (!olderThanOneDay) {
      return Promise.resolve(
        fromWei(ethValue, 'ether') * parseFloat(cachedEthUsd),
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
      return fromWei(ethValue, 'ether') * parseFloat(ethUsd);
    })
    .catch(console.warn);
};

export const getEtherscanLink = ({
  network = DEFAULT_NETWORK,
  linkType = 'address',
  addressOrHash,
}: EtherscanLinkProps): string => {
  if (!addressOrHash) {
    return '';
  }
  const tld = network === 'tobalaba' ? 'com' : 'io';
  const networkSubdomain =
    network === 'homestead' || network === 'mainnet' ? '' : `${network}.`;
  return `https://${networkSubdomain}etherscan.${tld}/${linkType}/${addressOrHash}`;
};
