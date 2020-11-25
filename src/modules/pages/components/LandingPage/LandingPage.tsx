import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import HookedColonyAvatar from '~dashboard/HookedColonyAvatar';
import Heading from '~core/Heading';

import { CREATE_COLONY_ROUTE } from '~routes/index';
import { useColonyQuery } from '~data/index';
import { COLONY_TO_EXPLORE } from '~constants';

import styles from './LandingPage.css';

const MSG = defineMessages({
  callToAction: {
    id: 'pages.LandingPage.callToAction',
    defaultMessage: 'Welcome, what would you like to do?',
  },
  createColony: {
    id: 'pages.LandingPage.createColony',
    defaultMessage: 'Create a colony',
  },
  exploreColony: {
    id: 'pages.LandingPage.exploreColony',
    defaultMessage: 'Explore the {colonyName} colony',
  },
});

const ColonyAvatar = HookedColonyAvatar({ fetchColony: false });

const displayName = 'pages.LandingPage';

const LandingPage = () => {
  const { data: colonyData } = useColonyQuery({
    variables: { address: COLONY_TO_EXPLORE },
  });

  return (
    <div className={styles.main}>
      <div className={styles.coloniesList}>
        <SubscribedColoniesList />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <div>
            <div className={styles.title}>
              <Heading
                text={MSG.callToAction}
                appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
              />
            </div>
            <ul>
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
              {colonyData && colonyData.colony && (
                <li className={styles.item}>
                  <NavLink
                    to={`/colony/${colonyData.colony.colonyName}`}
                    className={styles.itemLink}
                  >
                    <ColonyAvatar
                      className={styles.itemIcon}
                      colonyAddress={colonyData.colony.colonyAddress}
                      colony={colonyData.colony}
                      size="xl"
                    />
                    <span className={styles.itemTitle}>
                      <FormattedMessage
                        {...MSG.exploreColony}
                        values={{
                          colonyName:
                            colonyData.colony.displayName ||
                            colonyData.colony.colonyName,
                        }}
                      />
                    </span>
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

LandingPage.displayName = displayName;

export default LandingPage;
