/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskDomains.css';

import { domainMocks } from './__datamocks__/mockDomains';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskDomains.title',
    defaultMessage: 'Domain',
  },
  selectDomain: {
    id: 'dashboard.TaskDomains.selectDomain',
    defaultMessage: `{domainSelected, select,
      undefined {Add +}
      other {Modify}
    }`,
  },
});

type Props = {
  isTaskCreator?: boolean,
};

type State = {
  selectedDomainId: number | void,
};

class TaskDomains extends Component<Props, State> {
  static displayName = 'dashboard.TaskDomains';

  state = {
    selectedDomainId: undefined,
  };

  handleSetDomain = (domainValue: Object) => {
    this.setState({ selectedDomainId: domainValue.id });
    /*
     * @TODO This should call (most likely) an action creator, or otherwise,
     * do something the domain value
     */
    /* eslint-disable-next-line no-console */
    return console.log(TaskDomains.displayName, domainValue);
  };

  render() {
    const { isTaskCreator } = this.props;
    const { selectedDomainId } = this.state;
    return (
      <div className={styles.main}>
        {isTaskCreator && (
          <ItemsList
            list={domainMocks}
            itemDisplayPrefix="#"
            handleSetItem={this.handleSetDomain}
            name="taskDomains"
            connect={false}
          >
            <div className={styles.controls}>
              <Heading
                appearance={{ size: 'small', margin: 'none' }}
                text={MSG.title}
              />
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={MSG.selectDomain}
                textValues={{ domainSelected: selectedDomainId }}
              />
            </div>
          </ItemsList>
        )}
      </div>
    );
  }
}

export default TaskDomains;
