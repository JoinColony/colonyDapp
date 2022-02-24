import { useState, useEffect } from 'react';
import { open as purserOpenMetaMaskWallet } from '@purser/metamask';
import { open as purserOpenSoftwareWallet } from '@purser/software';

import { getAccounts } from '~users/ConnectWalletWizard/StepGanache';
import { WalletMethod } from '~immutable/index';
import { Address } from '~types/index';
import { createAddress } from '~utils/web3';
import { ActionTypes } from '~redux/index';

import { useAsyncFunction } from './hooks';
import { log } from './debug';

export const LAST_WALLET_KEY = 'colony-last-wallet-type';
export const LAST_ADDRESS_KEY = 'colony-last-wallet-address';

export const getLastWallet = () => ({
  type: localStorage.getItem(LAST_WALLET_KEY),
  address: localStorage.getItem(LAST_ADDRESS_KEY),
});

export const setLastWallet = (type: WalletMethod, address: Address) => {
  if (type !== WalletMethod.Ethereal) {
    localStorage.setItem(LAST_WALLET_KEY, type);
    localStorage.setItem(LAST_ADDRESS_KEY, address);
  }
};

export const clearLastWallet = () => {
  localStorage.removeItem(LAST_WALLET_KEY);
  localStorage.removeItem(LAST_ADDRESS_KEY);
};

export const useWalletAutoLogin = (
  lastWalletType: string,
  lastWalletAddress: string,
) => {
  const login = useAsyncFunction({
    submit: ActionTypes.WALLET_CREATE,
    success: ActionTypes.USER_CONTEXT_SETUP_SUCCESS,
    error: ActionTypes.WALLET_CREATE_ERROR,
  });

  const [loading, setLoading] = useState(
    lastWalletType === WalletMethod.MetaMask ||
      lastWalletType === WalletMethod.Ganache,
  );

  useEffect(() => {
    (async () => {
      if (lastWalletType === WalletMethod.MetaMask) {
        try {
          const wallet = await purserOpenMetaMaskWallet();
          if (
            createAddress(wallet.address) === createAddress(lastWalletAddress)
          ) {
            await login({ method: WalletMethod.MetaMask });
            setLoading(false);
            return;
          }
        } catch (error) {
          log.error(error);
          log.debug('MetaMask auto login was attempted and failed');
        }
        clearLastWallet();
        setLoading(false);
      }
      /*
       * process.env.DEV is set by the QA server in case we want to have a debug build.
       * We also don't want to load the accounts then
       */
      if (
        lastWalletType === WalletMethod.Ganache &&
        process.env.NODE_ENV === 'development' &&
        !process.env.DEV
      ) {
        try {
          const ganacheAccounts = getAccounts();
          const lastGanacheAccount = ganacheAccounts.find(
            ({ label }) => label === lastWalletAddress.toLowerCase(),
          );
          const wallet = await purserOpenSoftwareWallet({
            privateKey: lastGanacheAccount?.value,
          });
          const privateKey = wallet ? await wallet.getPrivateKey() : '';
          await login({
            method: WalletMethod.Ganache,
            privateKey,
          });
          setLoading(false);
          return;
        } catch (error) {
          log.error(error);
          log.debug('Ganache Account auto login was attempted and failed');
        }
        clearLastWallet();
        setLoading(false);
      }
    })();
  }, [lastWalletType, lastWalletAddress, login]);

  return loading;
};

/**
 * Will attempt to automatically log the user in based on last used wallet type
 * and address saved in localstorage. Currently supports only MetaMask.
 */
export const useAutoLogin = () => {
  const { type, address } = getLastWallet();
  const loadingWallet = useWalletAutoLogin(type || '', address || '');
  return loadingWallet;
};
