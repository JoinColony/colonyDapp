/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import Button from '~core/Button';
import Heading from '~core/Heading';
git a
import styles from './Admin.css';

const MSG = defineMessages({
  tabColonyProfile: {
    id: 'dashboard.Dashboard.tabColonyProfile',
    defaultMessage: 'Colony Profile',
  },
  tabAdvanced: {
    id: 'dashboard.Dashboard.tabAdvanced',
    defaultMessage: 'Advanced',
  },
  labelFilter: {
    id: 'dashboard.Admin.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Admin.placeholderFilter',
    defaultMessage: 'Filter',
  },
  filterOptionAll: {
    id: 'dashboard.Admin.filterOptionAll',
    defaultMessage: 'All open tasks',
  },
  filterOptionCreated: {
    id: 'dashboard.Admin.filterOptionCreated',
    defaultMessage: 'Created by you',
  },
  filterOptionAssigned: {
    id: 'dashboard.Admin.filterOptionAssigned',
    defaultMessage: 'Assigned to you',
  },
  filterOptionCompleted: {
    id: 'dashboard.Admin.filterOptionCompleted',
    defaultMessage: 'Completed',
  },
  emptyText: {
    id: 'dashboard.Admin.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
  newTaskButton: {
    id: 'dashboard.Admin.newTaskButton',
    defaultMessage: 'New Task',
  },
  sidebarDomainsTitle: {
    id: 'dashboard.Admin.sidebarDomainsTitle',
    defaultMessage: 'Domains',
  },
  allDomains: {
    id: 'dashboard.Admin.allDomains',
    defaultMessage: 'All',
  },
});

type Props = {};

type State = {};

export default class Admin extends Component<Props, State> {
  static displayName = 'dashboard.Admin';

  state = {};

  render() {
    return (
      <div className={styles.main}>
        <aside className={styles.colonyInfo}>Colony Settings</aside>
        <main className={styles.content}>
          <Tabs>
            <TabList>
              <Tab>
                <FormattedMessage {...MSG.tabColonyProfile} />
              </Tab>
              <Tab>
                <FormattedMessage {...MSG.tabAdvanced} />
              </Tab>
            </TabList>
            <TabPanel />
            <TabPanel />
          </Tabs>
        </main>
        <aside className={styles.sidebar} />
      </div>
    );
  }
}
