/* @flow */

import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import Organizations from '~admin/Organizations';
import Profile from '~admin/Profile';
import Profile from '~admin/Profile';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';
import VerticalNavigation from '~pages/VerticalNavigation';
import VerticalNavigation from '~pages/VerticalNavigation';
import { COLONY_HOME_ROUTE } from '~routes';
import { withFeatureFlags } from '~utils/hoc';

import { currentColony } from '../../../core/selectors';

import styles from './AdminDashboard.css';

import type {
  /*
   * Again, the same trick of making prettier not suggest a fix that would
   * break the eslint rules, by just adding a comment
   */
  NavigationItem,
} from '~pages/VerticalNavigation/VerticalNavigation.jsx';
import type { ColonyRecord } from '~types';
import type { Given } from '~utils/hoc';

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

const mockColonyRecoveryMode = true;

type Props = {
  colony: ColonyRecord,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
  given: Given,
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
    colony: {
      meta: { ensName },
      name,
    },
    given,
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
          <Icon name="circle-back" title="back" appearance={{ size: 'medium' }}/>
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
      {/*
       * @TODO Replace with actual selector that checks if the Colony is in recovery mode
       */}
      {given(mockColonyRecoveryMode) && <RecoveryModeAlert/>}
    </div>
  );
};

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default compose(
  withFeatureFlags(),
  connect(
    state => ({
      colony: currentColony(state),
    }),
  ),
)(AdminDashboard);
