import { BigNumber, formatUnits } from 'ethers/utils';
import { Network, ColonyVersion, releaseMap } from '@colony/colony-js';

import { DEFAULT_NETWORK } from '~constants';
import { NETWORK_RELEASES, ETHERSCAN_CONVERSION_RATE } from '~externalUrls';

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

interface BlockExplorerLinkProps {
  network?: string;
  linkType?: 'address' | 'tx' | 'token';
  addressOrHash: string;
}

/*
  Request dollar conversion value from etherScan
*/
export const getEthToUsd = (ethValue: BigNumber): Promise<number | void> => {
  const ETH_USD_KEY = 'ethUsd';
  const ETH_USD_TIMESTAMP_KEY = 'ethUsdTimestamp';

  const cachedEthUsd = localStorage.getItem(ETH_USD_KEY) || null;
  const cachedEthUsdTimestamp =
    localStorage.getItem(ETH_USD_TIMESTAMP_KEY) || null;
  const currentTimestamp = new Date().getTime();

  /**
   * Since the xDai token is "stable", it will always have parity to 1 USD
   */
  if (DEFAULT_NETWORK === Network.Xdai) {
    return new Promise((resolve) => {
      localStorage.setItem(ETH_USD_KEY, '1');
      localStorage.setItem(ETH_USD_TIMESTAMP_KEY, currentTimestamp.toString());
      return resolve(
        parseFloat(formatUnits(ethValue, 'ether')) * parseFloat('1'),
      );
    });
  }

  if (cachedEthUsd && cachedEthUsdTimestamp) {
    /*
      Cache exchange rate for one day
    */
    const olderThanOneDay =
      currentTimestamp - parseInt(cachedEthUsdTimestamp, 10) > 86400000;
    if (!olderThanOneDay) {
      return Promise.resolve(
        parseFloat(formatUnits(ethValue, 'ether')) * parseFloat(cachedEthUsd),
      );
    }
  }

  return fetch(ETHERSCAN_CONVERSION_RATE)
    .then((response) => {
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
      return parseFloat(formatUnits(ethValue, 'ether')) * parseFloat(ethUsd);
    })
    .catch(console.warn);
};

export const getBlockExplorerLink = ({
  network = DEFAULT_NETWORK,
  linkType = 'address',
  addressOrHash,
}: BlockExplorerLinkProps): string => {
  if (!addressOrHash) {
    return '';
  }
  if (network === Network.Local) {
    return '#';
  }
  if (network === Network.Xdai) {
    const xdaiLinkType = linkType === 'token' ? 'address' : linkType;
    /**
     * Using a network string template here since in the future we might wanna
     * support xdai's test networks as well (eg: sokol)
     */
    return `https://blockscout.com/poa/${network}/${xdaiLinkType}/${addressOrHash}`;
  }
  const tld = network === 'tobalaba' ? 'com' : 'io';
  const networkSubdomain =
    network === 'homestead' || network === Network.Mainnet ? '' : `${network}.`;
  return `https://${networkSubdomain}etherscan.${tld}/${linkType}/${addressOrHash}`;
};

export const getNetworkRelaseLink = (version: ColonyVersion) =>
  `${NETWORK_RELEASES}/${releaseMap[version]}`;
