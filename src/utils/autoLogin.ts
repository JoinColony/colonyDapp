import { useState, useEffect } from 'react';
import { open } from '@colony/purser-metamask';

import { WALLET_SPECIFICS } from '~immutable/index';
import { Address, createAddress } from '~types/index';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from './hooks';

export const LAST_WALLET_KEY = 'colony-last-wallet-type';
export const LAST_ADDRESS_KEY = 'colony-last-wallet-address';

export const getLastWallet = () => ({
  type: localStorage.getItem(LAST_WALLET_KEY),
  address: localStorage.getItem(LAST_ADDRESS_KEY),
});
export const setLastWallet = (type: WALLET_SPECIFICS, address: Address) => {
  localStorage.setItem(LAST_WALLET_KEY, type);
  localStorage.setItem(LAST_ADDRESS_KEY, address);
};
export const clearLastWallet = () => {
  localStorage.removeItem(LAST_WALLET_KEY);
  localStorage.removeItem(LAST_ADDRESS_KEY);
};

export const useMetaMaskAutoLogin = (
  lastWalletType: string,
  lastWalletAddress: string,
) => {
  const login = useAsyncFunction({
    submit: ActionTypes.WALLET_CREATE,
    success: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    error: ActionTypes.WALLET_CREATE_ERROR,
  });

  const [loading, setLoading] = useState(
    lastWalletType === WALLET_SPECIFICS.METAMASK,
  );
  const [shouldTry, setShouldTry] = useState(false);

  // Determine if we should attempt MM auto login
  useEffect(() => {
    (async () => {
      if (lastWalletType === WALLET_SPECIFICS.METAMASK) {
        try {
          const wallet = await open();
          if (
            createAddress(wallet.address) === createAddress(lastWalletAddress)
          ) {
            setShouldTry(true);
          } else {
            setLoading(false);
          }
        } catch (e) {
          setLoading(false);
        }
      }
    })();
  }, [lastWalletType, lastWalletAddress, setShouldTry]);

  // If we shoulld attempt, then give it a go
  useEffect(() => {
    (async () => {
      if (shouldTry) {
        try {
          await login({ method: WALLET_SPECIFICS.METAMASK });
        } catch (e) {
          setLoading(false);
        }
      }
    })();
  }, [login, shouldTry, setLoading]);

  return loading;
};

/**
 * Will attempt to automatically log the user in based on last used wallet type
 * and address saved in localstorage. Currently supports only MetaMask.
 */
export const useAutoLogin = () => {
  const { type, address } = getLastWallet();
  const loadingMetaMask = useMetaMaskAutoLogin(type || '', address || '');
  return loadingMetaMask;
};
