import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import SubscribedColoniesList from '~dashboard/SubscribedColoniesList';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';

import { CREATE_COLONY_ROUTE } from '~routes/index';

import styles from './LandingPage.css';

const MSG = defineMessages({
  createColony: {
    id: 'pages.LandingPage.createColony',
    defaultMessage: 'Create a colony',
  },
});

const displayName = 'pages.LandingPage';

const LandingPage = () => (
  <div className={styles.main}>
    <div className={styles.coloniesList}>
      <SubscribedColoniesList />
    </div>
    <div className={styles.contentWrapper}>
      <div className={styles.content}>
        <ul>
          <li className={styles.item}>
            <NavLink className={styles.itemLink} to={CREATE_COLONY_ROUTE}>
              <Icon
                className={styles.newColonyIcon}
                name="circle-plus"
                title={MSG.createColony}
              />
              <span className={styles.itemTitle}>
                <FormattedMessage {...MSG.createColony} />
              </span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

LandingPage.displayName = displayName;

export default LandingPage;
