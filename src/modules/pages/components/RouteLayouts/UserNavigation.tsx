import React, { useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';

import MaskedAddress from '~core/MaskedAddress';
import { MiniSpinnerLoader } from '~core/Preloaders';

import { GasStationPopover } from '~users/GasStation';
import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~users/AvatarDropdown';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';
import Tag from '~core/Tag';

import { useLoggedInUser } from '~data/index';
import { useSelector } from '~utils/hooks';
import { useAutoLogin, getLastWallet } from '~utils/autoLogin';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { SUPPORTED_NETWORKS } from '~constants';

import { groupedTransactionsAndMessages } from '../../../core/selectors';

import styles from './UserNavigation.css';

const MSG = defineMessages({
  inboxTitle: {
    id: 'pages.NavigationWrapper.UserNavigation.inboxTitle',
    defaultMessage: 'Go to your Inbox',
  },
  connectWallet: {
    id: 'pages.NavigationWrapper.UserNavigation.connectWallet',
    defaultMessage: 'Connect Wallet',
  },
  wrongNetworkAlert: {
    id: 'pages.NavigationWrapper.UserNavigation.wrongNetworkAlert',
    defaultMessage: 'Connected to wrong network',
  },
  walletAutologin: {
    id: 'pages.NavigationWrapper.UserNavigation.walletAutologin',
    defaultMessage: 'Connecting wallet...',
  },
  userReputationTooltip: {
    id: 'pages.NavigationWrapper.UserNavigation.userReputationTooltip',
    defaultMessage: 'This is your share of the reputation in this colony',
  },
  centralizedLabel: {
    id: 'pages.NavigationWrapper.UserNavigation.centralizedLabel',
    defaultMessage: 'Centralized Mode',
  },
  decentralizedLabel: {
    id: 'pages.NavigationWrapper.UserNavigation.decentralizedLabel',
    defaultMessage: 'Decentralized Mode',
  },
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const {
    walletAddress,
    ethereal,
    networkId,
    decentralized,
  } = useLoggedInUser();
  const dispatch = useDispatch();

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  const readyTransactions = useMemo(
    () => readyTransactionsCount(transactionAndMessageGroups),
    [transactionAndMessageGroups],
  );

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const userCanNavigate = !ethereal && isNetworkAllowed;

  const { type: lastWalletType, address: lastWalletAddress } = getLastWallet();
  const attemptingAutoLogin = useAutoLogin();
  const previousWalletConnected = lastWalletType && lastWalletAddress;

  useEffect(() => {
    if (!ethereal) {
      dispatch({ type: 'USER_CONNECTED', payload: { isUserConnected: true } });
    }
  }, [dispatch, ethereal]);

  return (
    <div className={styles.main}>
      <div className={styles.dcstatus}>
        <Tag
          appearance={{ theme: decentralized ? 'danger' : 'primary' }}
          text={decentralized ? MSG.decentralizedLabel : MSG.centralizedLabel}
        />
      </div>
      {userCanNavigate && (
        <div
          className={styles.networkInfo}
          title={
            isNetworkAllowed
              ? SUPPORTED_NETWORKS[networkId || 1].name
              : undefined
          }
        >
          {isNetworkAllowed && SUPPORTED_NETWORKS[networkId || 1].shortName}
        </div>
      )}
      {!ethereal && !isNetworkAllowed && (
        <div className={styles.wrongNetwork}>
          <FormattedMessage {...MSG.wrongNetworkAlert} />
        </div>
      )}
      {ethereal && (
        <ConnectWalletPopover>
          {({ isOpen, toggle, ref }) => (
            <button
              type="button"
              className={
                isOpen
                  ? styles.connectWalletButtonActive
                  : styles.connectWalletButton
              }
              ref={ref}
              onClick={toggle}
            >
              <FormattedMessage {...MSG.connectWallet} />
            </button>
          )}
        </ConnectWalletPopover>
      )}
      {previousWalletConnected && attemptingAutoLogin ? (
        <div className={styles.walletAutoLogin}>
          <MiniSpinnerLoader title={MSG.walletAutologin} />
        </div>
      ) : (
        <div className={styles.buttonsWrapper}>
          {userCanNavigate && (
            <GasStationPopover
              transactionAndMessageGroups={transactionAndMessageGroups}
            >
              {({ isOpen, toggle, ref }) => (
                <>
                  <button
                    type="button"
                    className={
                      isOpen ? styles.walletAddressActive : styles.walletAddress
                    }
                    ref={ref}
                    onClick={toggle}
                  >
                    <MaskedAddress address={walletAddress} />
                  </button>
                  {readyTransactions >= 1 && (
                    <span className={styles.readyTransactionsCount}>
                      {readyTransactions}
                    </span>
                  )}
                </>
              )}
            </GasStationPopover>
          )}
        </div>
      )}
      <AvatarDropdown onlyLogout={!isNetworkAllowed} />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
