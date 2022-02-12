import React, { useEffect } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import { CREATE_USER_ROUTE } from '~routes/index';
import { useLoggedInUser, useTopUsersLazyQuery, AnyUser } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';
import HookedUserAvatar from '~users/HookedUserAvatar';
import FriendlyName from '~core/FriendlyName';

import styles from './LandingPage.css';

const MSG = defineMessages({
  callToAction: {
    id: 'pages.LandingPage.callToAction',
    defaultMessage: 'Welcome',
  },
  wrongNetwork: {
    id: 'pages.LandingPage.wrongNetwork',
    defaultMessage: `You're connected to the wrong network. Please connect to the appriopriate Ethereum network.`,
  },
  createUser: {
    id: 'pages.LandingPage.createUser',
    defaultMessage: 'Register a username',
  },
  exploreAccounts: {
    id: 'pages.LandingPage.exploreAccounts',
    defaultMessage: 'Explore other accounts',
  },
  manuallyExplore: {
    id: 'pages.LandingPage.manuallyExplore',
    defaultMessage:
      'While fully decentralized, you have to manually explore user accounts',
  },
});

const displayName = 'pages.LandingPage';

const UserAvatar = HookedUserAvatar({ fetchUser: false });

const LandingPage = () => {
  const { networkId, ethereal, username, decentralized } = useLoggedInUser();

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  const [loadTopUsers, { data: topUsersData }] = useTopUsersLazyQuery();

  useEffect(() => {
    if (username && isNetworkAllowed) {
      loadTopUsers();
    }
  }, [isNetworkAllowed, loadTopUsers, username]);

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.title}>
          {ethereal && isNetworkAllowed && (
            <Heading
              text={MSG.callToAction}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )}
          {!ethereal && !isNetworkAllowed && (
            <Heading
              text={MSG.wrongNetwork}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )}
          {username && isNetworkAllowed && !decentralized && (
            <Heading
              text={MSG.exploreAccounts}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )}
          {username && isNetworkAllowed && decentralized && (
            <Heading
              text={MSG.manuallyExplore}
              appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
            />
          )}
        </div>
        <ul>
          {!username && isNetworkAllowed && (
            <li className={styles.item}>
              <NavLink to={CREATE_USER_ROUTE} className={styles.itemLink}>
                <Icon
                  className={styles.itemIcon}
                  name="circle-plus"
                  title={MSG.createUser}
                />
                <span className={styles.itemTitle}>
                  <FormattedMessage {...MSG.createUser} />
                </span>
              </NavLink>
            </li>
          )}
          {username &&
            isNetworkAllowed &&
            !decentralized &&
            topUsersData?.topUsers &&
            topUsersData.topUsers.map((user) => (
              <li className={styles.item} key={user?.id}>
                <NavLink
                  to={`/user/${user?.profile?.username}`}
                  className={styles.itemLink}
                >
                  <UserAvatar
                    className={styles.itemIcon}
                    address={user?.profile?.walletAddress as string}
                    notSet={false}
                    size="xs"
                  />
                  <span className={styles.itemTitle}>
                    <FriendlyName user={user as AnyUser} autoShrinkAddress />
                  </span>
                </NavLink>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
