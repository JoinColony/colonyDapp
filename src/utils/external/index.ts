import BN from 'bn.js';
import { fromWei } from 'ethjs-unit';
import { isAddress } from 'web3-utils';

import { Address } from '~types/index';

import { log } from '~utils/debug';

type EthUsdResponse = {
  status: string;
  message: string;
  result: {
    ethbtc: string;
    ethbtc_timestamp: string;
    ethusd: string;
    ethusd_timestamp: string;
  };
};

type TokenDetails = {
  name?: string;
  symbol?: string;
  decimals?: number;
  isVerified?: boolean;
};

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

/*
 * Lookup a token contract address to either get token details (verified)
 * or an error (unverified). Useful for bring-your-own-token.
 *
 * @NOTE only operates on mainnet.
 */
export const getTokenDetails = async (
  tokenAddress: Address,
): Promise<TokenDetails> => {
  const TOKEN_DETAILS_KEY = `tokenDetails_${tokenAddress}`;
  const TOKEN_TIMESTAMP_KEY = `tokenTimestamp_${tokenAddress}`;

  const cachedTokenDetails = localStorage.getItem(TOKEN_DETAILS_KEY) || null;
  const cachedTokenTimestamp =
    localStorage.getItem(TOKEN_TIMESTAMP_KEY) || null;
  const currentTimestamp = new Date().getTime();

  if (cachedTokenDetails && cachedTokenTimestamp) {
    const olderThanOneDay =
      currentTimestamp - parseInt(cachedTokenTimestamp, 10) >
      24 * 60 * 60 * 1000;
    if (!olderThanOneDay) {
      return Promise.resolve(JSON.parse(cachedTokenDetails));
    }
  }

  try {
    if (!isAddress(tokenAddress)) {
      // don't bother looking it up if it's an invalid token address
      throw Error('Invalid token address');
    }
    // eslint-disable-next-line max-len, prettier/prettier
    const endpoint = `//api.ethplorer.io/getTokenInfo/${tokenAddress}?apiKey=${process.env.ETHPLORER_API_KEY || 'freekey'}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.error) {
      throw new Error(`Ethplorer error: ${data.error.message}`);
    }
    const { name, symbol, decimals } = data;
    // Should be the same object as https://docs.colony.io/colonyjs/api-tokenclient#gettokeninfo (plus isVerified)
    const tokenDetails = {
      name,
      symbol,
      decimals: parseInt(decimals, 10),
      isVerified: true,
    };
    localStorage.setItem(TOKEN_DETAILS_KEY, JSON.stringify(tokenDetails));
    localStorage.setItem(TOKEN_TIMESTAMP_KEY, currentTimestamp.toString());
    return tokenDetails;
  } catch (caughtError) {
    log.warn(caughtError);
  }
  return {};
};
