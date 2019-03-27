/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { UserType } from '~immutable';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';

import { userDidClaimProfile } from '~immutable/utils';

import styles from './Dashboard.css';

import TabMyTasks from './TabMyTasks.jsx';

const MSG = defineMessages({
  tabMyTasks: {
    id: 'dashboard.Dashboard.tabMyTasks',
    defaultMessage: 'My Tasks',
  },
  tabMyColonies: {
    id: 'dashboard.Dashboard.tabMyColonies',
    defaultMessage: 'My Colonies (coming soon)',
  },
  labelFilter: {
    id: 'dashboard.Dashboard.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.Dashboard.placeholderFilter',
    defaultMessage: 'Filter',
  },
  helpText: {
    id: 'dashboard.Dashboard.helpText',
    defaultMessage: 'Need help using Colony? Visit our Help Center',
  },
  linkHelpCenter: {
    id: 'dashboard.Dashboard.linkHelpCenter',
    defaultMessage: 'Help Center',
  },
  filterOptionAll: {
    id: 'dashboard.Dashboard.filterOptionAll',
    defaultMessage: 'All open tasks',
  },
  filterOptionCreated: {
    id: 'dashboard.Dashboard.filterOptionCreated',
    defaultMessage: 'Created by you',
  },
  filterOptionAssigned: {
    id: 'dashboard.Dashboard.filterOptionAssigned',
    defaultMessage: 'Assigned to you',
  },
  filterOptionCompleted: {
    id: 'dashboard.Dashboard.filterOptionCompleted',
    defaultMessage: 'Completed',
  },
  initialTaskTitle: {
    id: 'dashboard.Dashboard.initialTaskTitle',
    defaultMessage: 'Get started with Colony',
  },
});

type Props = {|
  currentUser: UserType,
|};

type State = {|
  filterOption: 'all' | 'created' | 'assigned' | 'completed',
|};

const filterOptions = [
  { label: MSG.filterOptionAll, value: 'all' },
  { label: MSG.filterOptionCreated, value: 'created' },
  { label: MSG.filterOptionAssigned, value: 'assigned' },
  { label: MSG.filterOptionCompleted, value: 'completed' },
];

class Dashboard extends Component<Props, State> {
  static displayName = 'dashboard.Dashboard';

  state = {
    filterOption: 'all',
  };

  /* TODO: This has probably to be done using containers
    depending on the way data is fed into this component */
  setFilterOption = (
    _: string,
    value: $PropertyType<State, 'filterOption'>,
  ) => {
    this.setState({
      filterOption: value,
    });
  };

  render() {
    const { filterOption } = this.state;
    const { currentUser } = this.props;
    const filterSelect = (
      <Select
        appearance={{ alignOptions: 'right', theme: 'alt' }}
        connect={false}
        elementOnly
        label={MSG.labelFilter}
        name="filter"
        options={filterOptions}
        placeholder={MSG.placeholderFilter}
        form={{ setFieldValue: this.setFilterOption }}
        $value={filterOption}
      />
    );
    return (
      <div className={styles.layoutMain}>
        <main className={styles.content}>
          <Tabs>
            <TabList extra={filterSelect}>
              <Tab>
                <FormattedMessage {...MSG.tabMyTasks} />
              </Tab>
              <Tab disabled>
                <FormattedMessage {...MSG.tabMyColonies} />
              </Tab>
            </TabList>
            <TabPanel>
              <TabMyTasks
                initialTask={{
                  title: MSG.initialTaskTitle,
                  walletAddress: currentUser.profile.walletAddress,
                }}
                userClaimedProfile={userDidClaimProfile(currentUser)}
              />
            </TabPanel>
            <TabPanel>
              <h2>This should not be visible</h2>
            </TabPanel>
          </Tabs>
        </main>
        <aside className={styles.sidebar}>
          <p className={styles.helpText}>
            <FormattedMessage {...MSG.helpText} />
            <br />
            <br />
            <ExternalLink text={MSG.linkHelpCenter} href="#" />
          </p>
        </aside>
      </div>
    );
  }
}

export default Dashboard;
