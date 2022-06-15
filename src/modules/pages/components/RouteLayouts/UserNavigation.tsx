import React, { useMemo, useEffect } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Icon from '~core/Icon';
import MaskedAddress from '~core/MaskedAddress';
import MemberReputation from '~core/MemberReputation';
import { MiniSpinnerLoader } from '~core/Preloaders';
import { Tooltip } from '~core/Popover';

import { GasStationPopover, GasStationProvider } from '~users/GasStation';
import UserTokenActivationButton from '~users/UserTokenActivationButton';
import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~users/AvatarDropdown';
import InboxPopover from '~users/Inbox/InboxPopover';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';

import {
  useUserNotificationsQuery,
  useLoggedInUser,
  useUserBalanceWithLockQuery,
  useColonyFromNameQuery,
  Colony,
} from '~data/index';
import { useSelector } from '~utils/hooks';
import { useAutoLogin, getLastWallet } from '~utils/autoLogin';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { SUPPORTED_NETWORKS } from '~constants';

import { groupedTransactionsAndMessages } from '../../../core/selectors';

import styles from './UserNavigation.css';
import HamburgerMenu from '~core/HamburgerMenu/HamburgerMenu';
import { getUserTokenBalanceData } from '~utils/tokens';

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
    defaultMessage: `{isMobile, select,
      true {Connecting...}
      other {Connecting wallet...}
    }`,
  },
  userReputationTooltip: {
    id: 'pages.NavigationWrapper.UserNavigation.userReputationTooltip',
    defaultMessage: 'This is your share of the reputation in this colony',
  },
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const { walletAddress, ethereal, networkId } = useLoggedInUser();
  const { colonyName } = useParams<{
    colonyName: string;
  }>();
  const dispatch = useDispatch();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const {
    data: userData,
    loading: userDataLoading,
  } = useUserBalanceWithLockQuery({
    variables: {
      address: walletAddress,
      tokenAddress: colonyData?.processedColony?.nativeTokenAddress || '',
      colonyAddress: colonyData?.colonyAddress || '',
    },
  });

  const notifications = (data && data.user && data.user.notifications) || [];
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.read,
  );

  const transactionAndMessageGroups = useSelector(
    groupedTransactionsAndMessages,
  );

  const readyTransactions = useMemo(
    () => readyTransactionsCount(transactionAndMessageGroups),
    [transactionAndMessageGroups],
  );

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);
  const userCanNavigate = !ethereal && isNetworkAllowed;

  const userLock = userData?.user.userLock;
  const nativeToken = userLock?.nativeToken;

  const { type: lastWalletType, address: lastWalletAddress } = getLastWallet();
  const attemptingAutoLogin = useAutoLogin();
  const previousWalletConnected = lastWalletType && lastWalletAddress;

  const { formatMessage } = useIntl();

  useEffect(() => {
    if (!userDataLoading && !ethereal) {
      dispatch({ type: 'USER_CONNECTED', payload: { isUserConnected: true } });
    }
  }, [userDataLoading, userLock, dispatch, ethereal]);

  return (
    <>
      {
        // Only render fade element when wallet connected.
        !ethereal && <div className={styles.fade} />
      }
      <div className={styles.main}>
        {userCanNavigate && (
          <div
            className={`${styles.elementWrapper} ${styles.networkInfo}`}
            title={
              isNetworkAllowed
                ? SUPPORTED_NETWORKS[networkId || 1]?.name
                : undefined
            }
          >
            {isNetworkAllowed && SUPPORTED_NETWORKS[networkId || 1]?.shortName}
          </div>
        )}
        {!ethereal && !isNetworkAllowed && (
          <div className={`${styles.elementWrapper} ${styles.wrongNetwork}`}>
            <FormattedMessage {...MSG.wrongNetworkAlert} />
          </div>
        )}
        {userCanNavigate && colonyData?.colonyAddress && (
          <Tooltip
            content={formatMessage(MSG.userReputationTooltip)}
            placement="bottom-start"
            popperOptions={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
            }}
          >
            <div className={`${styles.elementWrapper} ${styles.reputation}`}>
              <MemberReputation
                walletAddress={walletAddress}
                colonyAddress={colonyData?.colonyAddress}
                showIconTitle={false}
              />
            </div>
          </Tooltip>
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
        {previousWalletConnected && attemptingAutoLogin && userDataLoading ? (
          <div className={styles.walletAutoLogin}>
            <MiniSpinnerLoader
              title={MSG.walletAutologin}
              titleTextValues={{ isMobile: false }}
            />
          </div>
        ) : (
          <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
            {userCanNavigate && nativeToken && userLock && (
              <UserTokenActivationButton
                tokenBalanceData={getUserTokenBalanceData(userLock)}
                colony={colonyData?.processedColony}
                walletAddress={walletAddress}
                dataTest="tokenActivationButton"
              />
            )}
            {userCanNavigate && (
              <GasStationProvider>
                <GasStationPopover
                  transactionAndMessageGroups={transactionAndMessageGroups}
                >
                  {({ isOpen, toggle, ref }) => (
                    <>
                      <button
                        type="button"
                        className={
                          isOpen
                            ? styles.walletAddressActive
                            : styles.walletAddress
                        }
                        ref={ref}
                        onClick={toggle}
                        data-test="gasStationPopover"
                      >
                        <span>
                          <MaskedAddress address={walletAddress} />
                        </span>
                      </button>
                      {readyTransactions >= 1 && (
                        <span className={styles.readyTransactionsCount}>
                          <span>{readyTransactions}</span>
                        </span>
                      )}
                    </>
                  )}
                </GasStationPopover>
              </GasStationProvider>
            )}
          </div>
        )}
        {userCanNavigate && (
          <InboxPopover notifications={notifications}>
            {({ isOpen, toggle, ref }) => (
              <button
                type="button"
                className={styles.notificationsButton}
                ref={ref}
                onClick={toggle}
              >
                <div
                  className={`${styles.notificationsIcon} ${
                    isOpen ? styles.notificationsIconActive : ''
                  }`}
                >
                  <Icon name="envelope" title={MSG.inboxTitle} />
                  {hasUnreadNotifications && (
                    <span className={styles.notificationsHighlight} />
                  )}
                </div>
              </button>
            )}
          </InboxPopover>
        )}
        <AvatarDropdown
          spinnerMsg={MSG.walletAutologin}
          colony={colonyData?.processedColony as Colony}
          preventTransactions={!isNetworkAllowed}
          tokenBalanceData={getUserTokenBalanceData(userLock)}
          appState={{
            previousWalletConnected,
            attemptingAutoLogin,
            userDataLoading,
            userCanNavigate,
          }}
        />
        <HamburgerMenu />
      </div>
    </>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
