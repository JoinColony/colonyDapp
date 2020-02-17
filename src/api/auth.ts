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

export const setToken = (walletAddress: string, token: string) =>
  localStorage.setItem(`${TOKEN_STORAGE}-${walletAddress}`, token);
export const getToken = (walletAddress: string) =>
  localStorage.getItem(`${TOKEN_STORAGE}-${walletAddress}`);
export const clearToken = (walletAddress: string) =>
  localStorage.removeItem(`${TOKEN_STORAGE}-${walletAddress}`);

export const authenticate = async wallet => {
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
