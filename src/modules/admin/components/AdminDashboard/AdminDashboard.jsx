/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { Node } from 'react';

import NavLink from '~core/NavLink';
import Icon from '~core/Icon';
import VerticalNavigation from '~core/VerticalNavigation';
import Heading from '~core/Heading';

import Profile from '~admin/Profile';
import Organizations from '~admin/Organizations';

import styles from './AdminDashboard.css';

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
    defaultMessage: 'Transaction',
  },
  tabOrganisation: {
    id: 'dashboard.Admin.tabOrganisation',
    defaultMessage: 'Organisation',
  },
});

type Props = {
  /*
   * This will most likely come from the redux state
   * The most obvious way to achieve this is to enhance this component with
   * a connect call
   */
  colonyName?: string,
};

type WrappedContentProps = {
  content: Node,
  children?: Node,
};

/*
 * This is just to reduce code repetition, since we want to able to control
 * the padding of the inner content from a central location
 */
const WrappedContent = ({ content, children }: WrappedContentProps) => (
  <div className={styles.contentWrapper}>{content || children}</div>
);

const navigationItems: Array<Object> = [
  {
    name: MSG.tabProfile,
    content: <WrappedContent content={<Profile />} />,
  },
  {
    name: MSG.tabTokens,
    content: <div>Tokens Content</div>,
  },
  {
    name: MSG.tabTransaction,
    content: <div>Transaction Content</div>,
  },
  {
    name: MSG.tabOrganisation,
    content: <WrappedContent content={<Organizations />} />,
  },
];

const displayName = 'admin.AdminDashboard';

const AdminDashboard = ({ colonyName = 'The Meta Colony' }: Props) => (
  <div className={styles.main}>
    <VerticalNavigation navigationItems={navigationItems}>
      <div className={styles.backNavigation}>
        <Icon name="back" title="back" appearance={{ size: 'medium' }} />
        <NavLink
          to="/colony"
          text={MSG.backButton}
          textValues={{ colonyName }}
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

AdminDashboard.displayName = displayName;

export default AdminDashboard;
