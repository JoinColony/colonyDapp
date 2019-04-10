/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';

import promiseListener from '../../../../createPromiseListener';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskDomains.css';

import mockDomains from '../../../../__mocks__/mockDomains';

import type { AsyncFunction } from '../../../../createPromiseListener';

import ACTIONS from '~redux/actions';

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

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ colonyName: *, domainId: *, draftId: * }>,
|};

type State = {
  selectedDomainId: number | void,
};

class TaskDomains extends Component<Props, State> {
  asyncFunc: AsyncFunction<Object, void>;

  static displayName = 'dashboard.TaskDomains';

  constructor(props: Props) {
    super(props);
    this.asyncFunc = promiseListener.createAsyncFunction({
      start: ACTIONS.TASK_SET_DOMAIN,
      resolve: ACTIONS.TASK_SET_DOMAIN_SUCCESS,
      reject: ACTIONS.TASK_SET_DOMAIN_ERROR,
    });
  }

  state = {
    selectedDomainId: undefined,
  };

  componentWillUnmount() {
    this.asyncFunc.unsubscribe();
  }

  handleSetDomain = async (domainValue: Object) => {
    const { colonyName, draftId } = this.props;
    try {
      await this.asyncFunc.asyncFunction({
        colonyName,
        domainId: domainValue.id,
        draftId,
      });
      this.setState({ selectedDomainId: domainValue.id });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { isTaskCreator, domainId } = this.props;
    const { selectedDomainId } = this.state;
    const list = Array(...mockDomains);
    return (
      <div className={styles.main}>
        {isTaskCreator && (
          <ItemsList
            list={list}
            itemDisplayPrefix="#"
            handleSetItem={this.handleSetDomain}
            name="taskDomains"
            connect={false}
            showArrow={false}
            itemId={domainId}
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
