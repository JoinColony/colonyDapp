/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import ColonyGrid from '~core/ColonyGrid';

import TaskList from '../TaskList';

import styles from './ColonyHome.css';

import mockTasks from './__datamocks__/mockTasks';
import mockColonies from './__datamocks__/mockColonies';

const MSG = defineMessages({
  tabContribute: {
    id: 'dashboard.Dashboard.tabContribute',
    defaultMessage: 'Contribute',
  },
  labelFilter: {
    id: 'dashboard.ColonyHome.labelFilter',
    defaultMessage: 'Filter',
  },
  placeholderFilter: {
    id: 'dashboard.ColonyHome.placeholderFilter',
    defaultMessage: 'Filter',
  },
  filterOptionAll: {
    id: 'dashboard.ColonyHome.filterOptionAll',
    defaultMessage: 'All open tasks',
  },
  filterOptionCreated: {
    id: 'dashboard.ColonyHome.filterOptionCreated',
    defaultMessage: 'Created by you',
  },
  filterOptionAssigned: {
    id: 'dashboard.ColonyHome.filterOptionAssigned',
    defaultMessage: 'Assigned to you',
  },
  filterOptionCompleted: {
    id: 'dashboard.ColonyHome.filterOptionCompleted',
    defaultMessage: 'Completed',
  },
  emptyText: {
    id: 'dashboard.ColonyHome.emptyText',
    defaultMessage: `It looks like you have not worked on any colonies.
Why don't you check out one of these colonies for tasks that you can complete:`,
  },
});

type Props = {};

type State = {
  filterOption: 'all' | 'created' | 'assigned' | 'completed',
};

const filterOptions = [
  { label: MSG.filterOptionAll, value: 'all' },
  { label: MSG.filterOptionCreated, value: 'created' },
  { label: MSG.filterOptionAssigned, value: 'assigned' },
  { label: MSG.filterOptionCompleted, value: 'completed' },
];

export default class ColonyHome extends Component<Props, State> {
  static displayName = 'dashboard.ColonyHome';

  state = {
    filterOption: 'all',
  };

  /*
   * @NOTE Also change this when working on the Dashboard tasks
   *
   * This is exactly the same as the task list from the dashboard, so it will be
   * wise to also work on this when implementing the real filtering login / tasks
   */
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
    /*
     * Tasks and colonies will most likely end up being passed in via props
     */
    const tasks = mockTasks;
    const colonies = mockColonies;
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
      <div className={styles.main}>
        <aside className={styles.colonyInfo}>Colony Info</aside>
        <main className={styles.content}>
          <Tabs>
            <TabList extra={filterSelect}>
              <Tab>
                <FormattedMessage {...MSG.tabContribute} />
              </Tab>
            </TabList>
            <TabPanel>
              {tasks && tasks.length ? (
                <TaskList tasks={tasks} />
              ) : (
                <Fragment>
                  <p className={styles.noTasks}>
                    <FormattedMessage {...MSG.emptyText} />
                  </p>
                  <ColonyGrid colonies={colonies} />
                </Fragment>
              )}
            </TabPanel>
          </Tabs>
        </main>
        <aside className={styles.sidebar}>Sidebar</aside>
      </div>
    );
  }
}
