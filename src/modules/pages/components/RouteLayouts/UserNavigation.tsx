import React, { useMemo, useEffect, useState } from 'react';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import cx from 'classnames';
import Icon from '~core/Icon';
import MaskedAddress from '~core/MaskedAddress';
import MemberReputation from '~core/MemberReputation';
import { MiniSpinnerLoader } from '~core/Preloaders';
import Popover, { Tooltip } from '~core/Popover';

import { GasStationPopover } from '~users/GasStation';
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
  useLatestRpcBlockQuery,
  useColonyServerLivenessQuery,
  useLatestSubgraphBlockQuery,
  useReputationOracleLivenessQuery,
} from '~data/index';
import { useSelector } from '~utils/hooks';
import { useAutoLogin, getLastWallet } from '~utils/autoLogin';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import { SUPPORTED_NETWORKS } from '~constants';

import { groupedTransactionsAndMessages } from '../../../core/selectors';

import styles from './UserNavigation.css';
import { NETWORK_HEALTH } from '~externalUrls';
import ExternalLink from '~core/ExternalLink';
import { MiniSpinnerLoaderWrapper } from '~core/MiniSpinnerLoaderWrapper';

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
  networkHealthHeader: {
    id: 'pages.NavigationWrapper.UserNavigation.networkHealthHeader',
    defaultMessage: `Network health is {networkHealth}`,
  },

  networkHealthDescription: {
    id: 'pages.NavigationWrapper.UserNavigation.networkHealthDescription',
    defaultMessage: `{networkHealth, select,
      poor
        {You should be able to perform actions, however,
        there is problem retrieving new information from the
        chain. We are working to resolve this.}
      critical
        {You will have trouble performing actions and retrieving
        information from the chain. We are working to resolve this.}
        other {Network is healthy.}}`,
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

  type NetworkHealthType = 'healthy' | 'poor' | 'critical';
  const [networkHealth, setNetworkHealth] = useState<NetworkHealthType>(
    'healthy',
  );

  const networkCheckInterval = 10 * 1000; // 3 minutes

  /* const TIMEOUT = 20 * 1000; // Timeout requests after 20 seconds */
  const networkHealthLoadingTime = 1 * 2000; // Show the mini spinner loader for 2 seconds

  const {
    data: latestRpcBlock,
    /* loading: latestRpcBlockLoading, */
    /* error: latestRpcBlockError, */
  } = useLatestRpcBlockQuery({
    pollInterval: networkCheckInterval,
  });

  const { data: isColonyServerAlive } = useColonyServerLivenessQuery({
    pollInterval: networkCheckInterval,
  });

  const { data: isReputationOracleAlive } = useReputationOracleLivenessQuery({
    pollInterval: networkCheckInterval,
  });

  const {
    data: latestSubgraphBlock,
    /* error: latestSubgraphBlockError, */
  } = useLatestSubgraphBlockQuery({
    pollInterval: networkCheckInterval,
  });

  useEffect(() => {
    const networkCheckTwo = setInterval(async () => {
      /* console.log( latestRpcBlock?.latestRpcBlock)
       *     console.log({isColonyServerAlive})
       * console.log(isReputationOracleAlive?.isReputationOracleAlive)
       * console.log({ latestSubgraphBlock}) */
      if (
        !isReputationOracleAlive?.isReputationOracleAlive ||
        !isColonyServerAlive?.isServerAlive
      ) {
        setNetworkHealth('poor');
      }
      if (
        latestRpcBlock &&
        latestSubgraphBlock &&
        parseInt(latestRpcBlock.latestRpcBlock, 10) >
          latestSubgraphBlock.justLatestSubgraphBlock
      ) {
        setNetworkHealth('poor');
      } else {
        // If everything is okay, set health to healthy (to correct for previous state)
        setNetworkHealth('healthy');
      }
      // @TODO the critical cases
    }, networkCheckInterval);
    return () => clearInterval(networkCheckTwo);
  });

  return (
    <div className={styles.main}>
      <p>{latestRpcBlock?.latestRpcBlock}</p>

      {networkHealth !== 'healthy' && (
        <div>
          <MiniSpinnerLoaderWrapper milliseconds={networkHealthLoadingTime}>
            <Popover
              appearance={{ theme: 'grey' }}
              showArrow={false}
              placement="bottom-start"
              content={() => (
                <div className={styles.networkHealth}>
                  <div className={styles.networkHealthHeading}>
                    <span
                      className={cx(
                        styles[`networkHealthIcon-${networkHealth}`],
                        styles.networkHealthIcon,
                      )}
                    >
                      <Icon name="triangle-warning" />
                    </span>
                    <span>
                      {formatMessage(MSG.networkHealthHeader, {
                        networkHealth,
                      })}
                    </span>
                  </div>
                  <span className={styles.networkHealthDescription}>
                    {formatMessage(MSG.networkHealthDescription, {
                      networkHealth,
                    })}
                  </span>

                  <ExternalLink
                    text={{ id: 'text.learnMore' }}
                    className={styles.link}
                    href={NETWORK_HEALTH}
                  />
                </div>
              )}
              popperProps={{
                modifiers: [
                  {
                    name: 'offset',
                    options: { offset: [0, 9] },
                  },
                ],
              }}
            >
              <div
                className={`${styles.elementWrapper}
                            ${styles.networkInfo}
                            ${styles.networkHealthHeading}`}
              >
                <span
                  className={cx(
                    styles[`networkHealthIcon-${networkHealth}`],
                    styles.networkHealthIcon,
                  )}
                >
                  <Icon name="triangle-warning" />
                </span>
                Network
              </div>
            </Popover>
          </MiniSpinnerLoaderWrapper>
        </div>
      )}
      {userCanNavigate && (
        <div
          className={`${styles.elementWrapper} ${styles.networkInfo}`}
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
          <MiniSpinnerLoader title={MSG.walletAutologin} />
        </div>
      ) : (
        <div className={`${styles.elementWrapper} ${styles.walletWrapper}`}>
          {userCanNavigate && nativeToken && userLock && (
            <UserTokenActivationButton
              nativeToken={nativeToken}
              userLock={userLock}
              colony={colonyData?.processedColony}
              walletAddress={walletAddress}
              dataTest="tokenActivationButton"
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
        onlyLogout={!isNetworkAllowed}
        colony={colonyData?.processedColony as Colony}
      />
    </div>
  );
};

UserNavigation.displayName = displayName;

export default UserNavigation;
