import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import Heading from '~core/Heading';
import { SpinnerLoader } from '~core/Preloaders';

import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useLoggedInUser, useMetaColonyQuery } from '~data/index';
import { checkIfNetworkIsAllowed } from '~utils/networks';

import styles from './LandingPage.css';

const MSG = defineMessages({
  callToAction: {
    id: 'pages.LandingPage.callToAction',
    defaultMessage: 'Welcome, what would you like to do?',
  },
  wrongNetwork: {
    id: 'pages.LandingPage.wrongNetwork',
    defaultMessage: `You're connected to the wrong network. Please connect to the appropriate network.`,
  },
  createColony: {
    id: 'pages.LandingPage.createColony',
    defaultMessage: 'Create a colony',
  },
  exploreColony: {
    id: 'pages.LandingPage.exploreColony',
    defaultMessage: 'Explore the {colonyName}',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const displayName = 'pages.LandingPage';

const LandingPage = () => {
  const { networkId, ethereal } = useLoggedInUser();

  const { data, loading } = useMetaColonyQuery();

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
          {(ethereal || isNetworkAllowed) && (
            <li className={styles.item}>
              <NavLink to={CREATE_COLONY_ROUTE} className={styles.itemLink}>
                <Icon
                  className={styles.itemIcon}
                  name="circle-plus"
                  title={MSG.createColony}
                />
                <span className={styles.itemTitle}>
                  <FormattedMessage {...MSG.createColony} />
                </span>
              </NavLink>
            </li>
          )}
          {loading && !data?.processedMetaColony && (
            <li className={styles.itemLoading}>
              <SpinnerLoader appearance={{ size: 'medium' }} />
            </li>
          )}
          {data?.processedMetaColony && (
            <li className={styles.item}>
              <NavLink
                to={`/colony/${data?.processedMetaColony.colonyName}`}
                className={styles.itemLink}
              >
                <ColonyAvatar
                  className={styles.itemIcon}
                  colonyAddress={data?.processedMetaColony?.colonyAddress}
                  colony={data?.processedMetaColony}
                  size="xl"
                />
                <span className={styles.itemTitle}>
                  <FormattedMessage
                    {...MSG.exploreColony}
                    values={{
                      colonyName:
                        data?.processedMetaColony.displayName ||
                        data?.processedMetaColony.colonyName,
                    }}
                  />
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
