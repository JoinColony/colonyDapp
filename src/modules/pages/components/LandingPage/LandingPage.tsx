import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';

import { CREATE_USER_ROUTE } from '~routes/index';
import { useLoggedInUser } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

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
});

const displayName = 'pages.LandingPage';

const LandingPage = () => {
  const { networkId, ethereal, username } = useLoggedInUser();

  const isNetworkAllowed = checkIfNetworkIsAllowed(networkId);

  return (
    <div className={styles.main}>
      <div>
        <div className={styles.title}>
          {(ethereal || isNetworkAllowed) && (
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
        </ul>
      </div>
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
