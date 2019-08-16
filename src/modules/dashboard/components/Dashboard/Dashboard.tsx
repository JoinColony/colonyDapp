import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { UserType } from '~immutable/index';
import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import { userDidClaimProfile } from '../../../users/checks';
import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';
import TabMyTasks from './TabMyTasks';
import TabMyColonies from './TabMyColonies';
import styles from './Dashboard.css';

const MSG = defineMessages({
  tabMyTasks: {
    id: 'dashboard.Dashboard.tabMyTasks',
    defaultMessage: 'My Tasks',
  },
  tabMyColonies: {
    id: 'dashboard.Dashboard.tabMyColonies',
    defaultMessage: 'My Colonies',
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
    defaultMessage: 'Need help using Colony? Visit our {helpCenter}',
  },
  linkHelpCenter: {
    id: 'dashboard.Dashboard.linkHelpCenter',
    defaultMessage: 'Help Center',
  },
  initialTaskTitle: {
    id: 'dashboard.Dashboard.initialTaskTitle',
    defaultMessage: 'Get started with Colony',
  },
});

interface Props {
  currentUser: UserType;
}

interface State {
  filterOption: TasksFilterOptionType;
  tabIndex: number;
}

class Dashboard extends Component<Props, State> {
  static displayName = 'dashboard.Dashboard';

  state = {
    filterOption: TasksFilterOptions.ALL_OPEN,
    tabIndex: 0,
  };

  setFilterOption = (_: string, value: State['filterOption']) => {
    this.setState({
      filterOption: value,
    });
  };

  setTabIndex = (tabIndex: number) => {
    this.setState({
      tabIndex,
    });
  };

  render() {
    const { filterOption, tabIndex } = this.state;
    const {
      currentUser = { profile: {} },
      currentUser: {
        profile: { walletAddress = undefined },
      },
    } = this.props;
    const filterSelect = tabIndex === 0 && (
      <Select
        appearance={{ alignOptions: 'right', theme: 'alt' }}
        connect={false}
        elementOnly
        label={MSG.labelFilter}
        name="filter"
        options={tasksFilterSelectOptions}
        placeholder={MSG.placeholderFilter}
        form={{ setFieldValue: this.setFilterOption }}
        $value={filterOption}
      />
    );
    return (
      <div className={styles.layoutMain} data-test="dashboard">
        <main className={styles.content}>
          <Tabs onSelect={this.setTabIndex}>
            <TabList extra={filterSelect}>
              <Tab>
                <FormattedMessage {...MSG.tabMyTasks} />
              </Tab>
              <Tab>
                <FormattedMessage {...MSG.tabMyColonies} />
              </Tab>
            </TabList>
            <TabPanel>
              <TabMyTasks
                initialTask={{
                  title: MSG.initialTaskTitle,
                  walletAddress,
                }}
                userClaimedProfile={userDidClaimProfile(
                  currentUser as UserType,
                )}
                filterOption={filterOption}
                walletAddress={walletAddress}
              />
            </TabPanel>
            <TabPanel>
              <TabMyColonies />
            </TabPanel>
          </Tabs>
        </main>
        <aside className={styles.sidebar}>
          <p className={styles.helpText}>
            <FormattedMessage
              {...MSG.helpText}
              values={{
                helpCenter: (
                  <ExternalLink
                    text={MSG.linkHelpCenter}
                    href="https://help.colony.io/"
                  />
                ),
              }}
            />
          </p>
        </aside>
      </div>
    );
  }
}

export default Dashboard;
