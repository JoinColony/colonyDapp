/* @flow */

import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import Heading from '~core/Heading';
import VerticalNavigation from '~pages/VerticalNavigation';
import Profile from '~admin/Profile';
import Organizations from '~admin/Organizations';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';

import type { ColonyRecord, ENSName } from '~types';

import { withColony } from '../../../core/hocs';

import styles from './AdminDashboard.css';

import type {
  /*
   * Again, the same trick of making prettier not suggest a fix that would
   * break the eslint rules, by just adding a comment
   */
  NavigationItem,
} from '~pages/VerticalNavigation/VerticalNavigation.jsx';

const MSG = defineMessages({
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {colonyName}',
  },
  colonySettings: {
    id: 'dashboard.Admin.colonySettings',
    defaultMessage: 'Colony Settings',
  },
  tabProfile: {
    id: 'dashboard.Admin.tabProfile',
    defaultMessage: 'Profile',
  },
  tabTokens: {
    id: 'dashboard.Admin.tabTokens',
    defaultMessage: 'Tokens',
  },
  tabTransaction: {
    id: 'dashboard.Admin.tabTransaction',
    defaultMessage: 'Transactions',
  },
  tabOrganisation: {
    id: 'dashboard.Admin.tabOrganisation',
    defaultMessage: 'Organisation',
  },
});

type Props = {
  ensName: ENSName,
  colony: ColonyRecord,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
};

const navigationItems = ({ colony }: Props): Array<NavigationItem> => [
  {
    id: 1,
    title: MSG.tabProfile,
    content: <Profile colony={colony} />,
  },
  {
    id: 2,
    title: MSG.tabTokens,
    content: <Tokens />,
  },
  {
    id: 3,
    title: MSG.tabTransaction,
    content: <Transactions />,
  },
  {
    id: 4,
    title: MSG.tabOrganisation,
    content: <Organizations />,
  },
];

const AdminDashboard = (props: Props) => {
  const {
    colony: { name },
    ensName,
    location,
  } = props;
  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(props)}
        initialTab={
          location && location.state && location.state.initialTab ? 1 : 0
        }
      >
        <div className={styles.backNavigation}>
          <Icon
            name="circle-back"
            title="back"
            appearance={{ size: 'medium' }}
          />
          <NavLink
            to={`colony/${ensName}`}
            text={MSG.backButton}
            textValues={{ name }}
          />
        </div>
        <div className={styles.headingWrapper}>
          <Heading
            appearance={{
              size: 'normal',
              weight: 'medium',
              margin: 'small',
              theme: 'dark',
            }}
            text={MSG.colonySettings}
          />
        </div>
      </VerticalNavigation>
    </div>
  );
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default withColony(AdminDashboard);
