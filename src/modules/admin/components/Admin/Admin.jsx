/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import NavLink from '~core/NavLink';
import Icon from '~core/Icon';

import styles from './Admin.css';

import Profile from './Profile.jsx';

const MSG = defineMessages({
  tabColonyProfile: {
    id: 'dashboard.Admin.tabColonyProfile',
    defaultMessage: 'Colony Profile',
  },
  tabAdvanced: {
    id: 'dashboard.Admin.tabAdvanced',
    defaultMessage: 'Advanced',
  },
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

type Props = {};

export default class Admin extends Component<Props> {
  colonyName: 'Colony';

  static displayName = 'dashboard.Admin';

  componentWillMount() {
    // TODO: get current Colony from Redux
    this.colonyName = 'Colony';
  }

  render() {
    return (
      <div className={styles.main}>
        <aside className={styles.colonyInfo}>
          <header className={styles.header}>
            <Icon name="back" title="back" appearance={{ size: 'medium' }} />
            <NavLink className={styles.boldLink} to="/colony">
              <FormattedMessage
                {...MSG.backButton}
                values={{
                  colonyName: this.colonyName,
                }}
              />
            </NavLink>
          </header>
        </aside>
        <Tabs className={styles.vertical}>
          <TabList
            appearance={{ theme: 'vertical' }}
            headline={MSG.colonySettings}
          >
            <Tab>
              <FormattedMessage {...MSG.tabProfile} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.tabTokens} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.tabTransaction} />
            </Tab>
            <Tab>
              <FormattedMessage {...MSG.tabOrganisation} />
            </Tab>
          </TabList>
          <TabPanel>
            <Profile />
          </TabPanel>
          <TabPanel>Tokens</TabPanel>
          <TabPanel>Transaction</TabPanel>
          <TabPanel>Organisation</TabPanel>
        </Tabs>
      </div>
    );
  }
}
