import React, { useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { GasStationPopover } from '~users/GasStation';
import UserTokenActivationButton from '~users/UserTokenActivationButton';
import { readyTransactionsCount } from '~users/GasStation/transactionGroup';
import AvatarDropdown from '~users/AvatarDropdown';
import Icon from '~core/Icon';
import InboxPopover from '~users/Inbox/InboxPopover';
import { ConnectWalletPopover } from '~users/ConnectWalletWizard';
import {
  useUserNotificationsQuery,
  useLoggedInUser,
  useUserBalanceWithLockQuery,
  useColonyFromNameQuery,
} from '~data/index';
import MaskedAddress from '~core/MaskedAddress';
import MemberReputation from '~core/MemberReputation';
import { groupedTransactionsAndMessages } from '../../../core/selectors';
import { useSelector } from '~utils/hooks';
import { ALLOWED_NETWORKS } from '~constants';

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
});

const displayName = 'pages.NavigationWrapper.UserNavigation';

const UserNavigation = () => {
  const { walletAddress, ethereal, networkId } = useLoggedInUser();
  const { colonyName } = useParams<{
    colonyName: string;
  }>();

  const { data: colonyData } = useColonyFromNameQuery({
    variables: { name: colonyName, address: '' },
  });

  const { data } = useUserNotificationsQuery({
    variables: { address: walletAddress },
  });

  const { data: userData } = useUserBalanceWithLockQuery({
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

  const isNetworkAllowed = !!ALLOWED_NETWORKS[networkId || 1];
  const userCanNavigate = !ethereal && isNetworkAllowed;

  const userLock = userData?.user.userLock;
  const nativeToken = userLock?.nativeToken;

  return (
    <div className={styles.main}>
      {userCanNavigate && (
        <div
          className={styles.networkInfo}
          title={isNetworkAllowed && ALLOWED_NETWORKS[networkId || 1].name}
        >
          {isNetworkAllowed && ALLOWED_NETWORKS[networkId || 1].shortName}
        </div>
      )}
      {!ethereal && !isNetworkAllowed && (
        <div className={styles.wrongNetwork}>
          <FormattedMessage {...MSG.wrongNetworkAlert} />
        </div>
      )}
      {userCanNavigate && colonyData?.colonyAddress && (
        <div className={styles.reputation}>
          <MemberReputation
            walletAddress={walletAddress}
            colonyAddress={colonyData?.colonyAddress}
          />
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
      <div className={styles.buttonsWrapper}>
        {userCanNavigate && nativeToken && userLock && (
          <UserTokenActivationButton
            nativeToken={nativeToken}
            userLock={userLock}
            colonyAddress={colonyData?.colonyAddress || ''}
          />
        )}
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
      <AvatarDropdown onlyLogout={!isNetworkAllowed} />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
