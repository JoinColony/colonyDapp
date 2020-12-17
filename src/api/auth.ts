import jwtDecode from 'jwt-decode';

import { createAddress } from '~utils/web3';
import { log } from '~utils/debug';

const TOKEN_STORAGE = 'colony-server-token';

const postRequest = async (path: string, data: object) => {
  const response = await fetch(`${process.env.SERVER_ENDPOINT}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const setTokenStorage = () =>
  localStorage.setItem(TOKEN_STORAGE, JSON.stringify({}));

export const setToken = (walletAddress: string, token: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (!storedTokens) {
    setTokenStorage();
  }

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`] = token;

    localStorage.setItem(TOKEN_STORAGE, JSON.stringify(parsedStoredTokens));
  }
};

export const getToken = (walletAddress: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    return parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`];
  }

  return null;
};

export const clearToken = (walletAddress: string) => {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE);

  if (storedTokens) {
    const parsedStoredTokens = JSON.parse(storedTokens);

    delete parsedStoredTokens[`${TOKEN_STORAGE}-${walletAddress}`];

    localStorage.setItem(TOKEN_STORAGE, JSON.stringify(parsedStoredTokens));
  }
};

export const authenticate = async (wallet) => {
  try {
    const token = getToken(wallet.address);

    if (token) {
      const tokenData = jwtDecode(token);
      if (
        createAddress(tokenData.address) === createAddress(wallet.address) &&
        // JWT expiry dates are noted in seconds
        tokenData.exp * 10 ** 3 > Date.now()
      ) {
        return token;
      }
    }
  } catch (error) {
    log.error(error);
    log.debug(
      `Found invalid JWT, clearing token for address ${wallet.address}`,
    );
    clearToken(wallet.address);
  }

  const { challenge } = await postRequest('/auth/challenge', {
    address: wallet.address,
  });
  const signature = await wallet.signMessage({ message: challenge });
  const { token: refreshedToken } = await postRequest('/auth/token', {
    challenge,
    signature,
  });
  setToken(wallet.address, refreshedToken);
  return refreshedToken;
};
