import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import { UserType } from '~immutable/index';

import { Select } from '~core/Fields';
import { userDidClaimProfile } from '../../../users/checks';
import {
  TasksFilterOptionType,
  TasksFilterOptions,
  tasksFilterSelectOptions,
} from '../shared/tasksFilter';

import TabMyTasks from './TabMyTasks';
import ColoniesList from './ColoniesList';

import styles from './Dashboard.css';

const MSG = defineMessages({
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
}

class Dashboard extends Component<Props, State> {
  static displayName = 'dashboard.Dashboard';

  state = {
    filterOption: TasksFilterOptions.ALL_OPEN,
  };

  setFilterOption = (_: string, value: State['filterOption']) => {
    this.setState({
      filterOption: value,
    });
  };

  render() {
    const { filterOption } = this.state;
    const {
      currentUser = { profile: {} },
      currentUser: {
        profile: { walletAddress = undefined },
      },
    } = this.props;
    return (
      <div className={styles.layoutMain} data-test="dashboard">
        <main className={styles.content}>
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
          <TabMyTasks
            initialTask={{
              title: MSG.initialTaskTitle,
              walletAddress,
            }}
            userClaimedProfile={userDidClaimProfile(currentUser as UserType)}
            filterOption={filterOption}
            walletAddress={walletAddress}
          />
        </main>
        <aside className={styles.sidebar}>
          <ColoniesList />
        </aside>
      </div>
    );
  }
}

export default Dashboard;
