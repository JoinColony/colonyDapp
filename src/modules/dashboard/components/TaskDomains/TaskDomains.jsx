/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';

import styles from './TaskDomains.css';

import { selectedDomainMock, domainMocks } from './__datamocks__/mockDomains';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domain',
  },
  addDomain: {
    id: 'dashboard.TaskDomains.add',
    defaultMessage: 'Add +',
  },
});

type ConsumableDomain = {
  id: number,
  name: string,
};

type Props = {};

type State = {
  /*
   * Domain selected in the popover list
   */
  selectedDomain: number | void,
  /*
   * Domain that is actually set on the task
   */
  setDomain: number | void,
};

class TaskDomains extends Component<Props, State> {
  static displayName = 'dashboard.TaskDomains';

  state = {
    selectedDomain: undefined,
    setDomain: undefined,
  };

  componentDidMount() {
    /*
     * This should be fetch from somewhere like the DDB
     */
    this.allDomains = domainMocks;
    /*
     * If a domain is already set on the task, set it directly as `setDomain`
     * Most likely we'll get this value from the redux state
     */
    if (selectedDomainMock) {
      this.setState({
        setDomain: selectedDomainMock,
      });
    }
  }

  allDomains: Array<ConsumableDomain> = [];

  render() {
    const {
      state: { setDomain: setDomainId },
      allDomains,
    } = this;
    const currentDomain: ConsumableDomain | void = allDomains.find(
      ({ id }) => id === setDomainId,
    );
    return (
      <div className={styles.main}>
        <div className={styles.controls}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.title}
          />
          <Button
            appearance={{ theme: 'blue', size: 'small' }}
            text={MSG.addDomain}
          />
        </div>
        <div className={styles.selectedDomain}>
          {currentDomain && `#${currentDomain.name}`}
        </div>
      </div>
    );
  }
}

export default TaskDomains;
