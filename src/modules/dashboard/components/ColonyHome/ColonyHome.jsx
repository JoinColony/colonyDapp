/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import { Select } from '~core/Fields';
import ColonyGrid from '~core/ColonyGrid';
import Button from '~core/Button';
import Heading from '~core/Heading';
import TaskList from '~dashboard/TaskList';
import RecoveryModeAlert from '~admin/RecoveryModeAlert';

import ColonyMeta from './ColonyMeta';

import styles from './ColonyHome.css';

import mockColonyFounders from './__datamocks__/mockColonyFounders';
import mockTasks from '../../../../__mocks__/mockTasks';
import mockColonies from '../../../../__mocks__/mockColonies';

import type { ColonyType, DataType, DomainType, UserType } from '~immutable';
import type { Given } from '~utils/hoc';

const mockColonyRecoveryMode = true;

const MSG = defineMessages({
  tabContribute: {
    id: 'dashboard.ColonyHome.tabContribute',
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
  newTaskButton: {
    id: 'dashboard.ColonyHome.newTaskButton',
    defaultMessage: 'New Task',
  },
  sidebarDomainsTitle: {
    id: 'dashboard.ColonyHome.sidebarDomainsTitle',
    defaultMessage: 'Domains',
  },
  allDomains: {
    id: 'dashboard.ColonyHome.allDomains',
    defaultMessage: 'All',
  },
});

type Props = {|
  colony: ?DataType<ColonyType>,
  walletAddress: string,
  given: Given,
  colonyAdmins: Array<UserType>,
  colonyDomains: Array<DataType<DomainType>>,
|};

type State = {|
  filterOption: 'all' | 'created' | 'assigned' | 'completed',
  filteredDomainId: number,
|};

const filterOptions = [
  { label: MSG.filterOptionAll, value: 'all' },
  { label: MSG.filterOptionCreated, value: 'created' },
  { label: MSG.filterOptionAssigned, value: 'assigned' },
  { label: MSG.filterOptionCompleted, value: 'completed' },
];

class ColonyHome extends Component<Props, State> {
  static displayName = 'dashboard.ColonyHome';

  static defaultProps = {
    inRecovery: false,
    colonyDomains: [],
  };

  state = {
    filterOption: 'all',
    filteredDomainId: 0,
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

  /*
   * @TODO Replace with actual filtering logic
   */
  setDomainFilter = (id: number = 0) => this.setState({ filteredDomainId: id });

  getActiveDomainFilterClass = (id: number = 0) => {
    const { filteredDomainId } = this.state;
    return filteredDomainId === id
      ? styles.filterItemActive
      : styles.filterItem;
  };

  render() {
    const { filterOption } = this.state;
    const {
      colony,
      colonyAdmins,
      colonyDomains,
      given,
      walletAddress,
    } = this.props;
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
        <aside className={styles.colonyInfo}>
          {colony && colony.record ? (
            <ColonyMeta
              colony={colony.record}
              founders={mockColonyFounders}
              admins={colonyAdmins}
              /*
               * TODO This needs real logic to determine if the user is an admin
               */
              isAdmin={!!walletAddress}
            />
          ) : null}
        </aside>
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
        <aside className={styles.sidebar}>
          {/* //TODO: Show this only to admins once we know user roles */}
          <Button
            text={MSG.newTaskButton}
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => 'unset'}
            disabled={given(mockColonyRecoveryMode)}
          />
          <ul className={styles.domainsFilters}>
            <Heading
              appearance={{ size: 'normal', weight: 'bold' }}
              text={MSG.sidebarDomainsTitle}
            />
            <li>
              <Button
                className={this.getActiveDomainFilterClass()}
                onClick={() => this.setDomainFilter()}
              >
                <FormattedMessage {...MSG.allDomains} />
              </Button>
            </li>
            {colonyDomains.map(domain => {
              /*
               * @NOTE Need to check for the existence of the `record` property
               * since the domain might not be loaded yet.
               */
              if (domain.record) {
                const { name, id } = domain.record;
                return (
                  <li key={`domain_${id}`}>
                    <Button
                      className={this.getActiveDomainFilterClass(id)}
                      onClick={() => this.setDomainFilter(id)}
                    >
                      #{name}
                    </Button>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </aside>
        {given(mockColonyRecoveryMode) && <RecoveryModeAlert />}
      </div>
    );
  }
}

export default ColonyHome;
