/* @flow */

import type { LocationShape } from 'react-router-dom';

import React from 'react';
import { defineMessages } from 'react-intl';
import { compose } from 'recompose';

import Heading from '~core/Heading';
import Icon from '~core/Icon';
import NavLink from '~core/NavLink';
import LoadingTemplate from '~pages/LoadingTemplate';
import Organizations from '~admin/Organizations';
import Profile from '~admin/Profile';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';
import Tokens from '~admin/Tokens';
import Transactions from '~admin/Transactions';
import VerticalNavigation from '~pages/VerticalNavigation';
import { withFeatureFlags } from '~utils/hoc';

import { withColonyFromRoute } from '../../../core/hocs';

import styles from './AdminDashboard.css';

import type {
  /*
   * Again, the same trick of making prettier not suggest a fix that would
   * break the eslint rules, by just adding a comment
   */
  NavigationItem,
} from '~pages/VerticalNavigation/VerticalNavigation.jsx';
import type { ColonyRecord, DataRecord } from '~immutable';
import type { Given } from '~utils/hoc';

const MSG = defineMessages({
  loadingText: {
    id: 'dashboard.Admin.loadingText',
    defaultMessage: 'Loading Colony',
  },
  backButton: {
    id: 'dashboard.Admin.backButton',
    defaultMessage: 'Go to {name}',
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
  colony: ?DataRecord<ColonyRecord>,
  /*
   * The flow type for this exists
   * This location object  will allow opening a tab on initial render
   */
  location?: ?LocationShape,
  given: Given,
};

const navigationItems = (colony: ColonyRecord): Array<NavigationItem> => [
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
    content: (
      <Transactions
        colonyAddress={colony.address}
        colonyENSName={colony.ensName}
      />
    ),
  },
  {
    id: 4,
    title: MSG.tabOrganisation,
    content: <Organizations colony={colony} />,
  },
];

const AdminDashboard = (props: Props) => {
  const { colony, given, location } = props;

  if (!colony || !colony.record)
    return <LoadingTemplate loadingText={MSG.loadingText} />;

  const { ensName, name } = colony.record;
  return (
    <div className={styles.main}>
      <VerticalNavigation
        navigationItems={navigationItems(colony.record)}
        initialTab={
          location && location.state && location.state.initialTab
            ? location.state.initialTab
            : 0
        }
      >
        <div className={styles.backNavigation}>
          <Icon
            name="circle-back"
            title="back"
            appearance={{ size: 'medium' }}
          />
          <NavLink
            to={`/colony/${ensName}`}
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
      {given(mockColonyRecoveryMode) && <RecoveryModeAlert />}
    </div>
  );
};

AdminDashboard.defaultProps = {
  colonyName: 'meta-colony',
  colonyLabel: 'The Meta Colony',
};

AdminDashboard.displayName = 'admin.AdminDashboard';

export default compose(
  withColonyFromRoute,
  withFeatureFlags(),
)(AdminDashboard);
