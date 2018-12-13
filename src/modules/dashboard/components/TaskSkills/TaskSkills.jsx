/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import promiseListener from '../../../../createPromiseListener';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskSkills.css';

import taskSkills from './taskSkillsTree';

import type { AsyncFunction } from '../../../../createPromiseListener';

import {
  TASK_SET_SKILL,
  TASK_SET_SKILL_ERROR,
  TASK_SET_SKILL_SUCCESS,
} from '../../actionTypes';

const MSG = defineMessages({
  title: {
    id: 'dashboard.TaskSkills.title',
    defaultMessage: 'Skills',
  },
  selectSkill: {
    id: 'dashboard.TaskSkills.selectSkill',
    defaultMessage: `{skillSelected, select,
      undefined {Add +}
      other {Modify}
    }`,
  },
});

type Props = {
  isTaskCreator?: boolean,
  taskId: number,
};

type State = {
  selectedSkillId: number | void,
};

class TaskSkills extends Component<Props, State> {
  asyncFunc: AsyncFunction<Object, void>;

  static displayName = 'dashboard.TaskSkills';

  constructor(props: Props) {
    super(props);

    this.asyncFunc = promiseListener.createAsyncFunction({
      start: TASK_SET_SKILL,
      resolve: TASK_SET_SKILL_SUCCESS,
      reject: TASK_SET_SKILL_ERROR,
    });
  }

  state = {
    selectedSkillId: undefined,
  };

  componentWillUnmount() {
    this.asyncFunc.unsubscribe();
  }

  handleSetSkill = async (skillValue: Object) => {
    const { taskId } = this.props;
    try {
      await this.asyncFunc.asyncFunction({
        skillId: skillValue.id,
        taskId,
      });
      this.setState({ selectedSkillId: skillValue.id });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { isTaskCreator } = this.props;
    const { selectedSkillId } = this.state;
    const list = Array(...taskSkills);
    return (
      <div className={styles.main}>
        {isTaskCreator && (
          <ItemsList
            list={list}
            handleSetItem={this.handleSetSkill}
            name="taskSkills"
            connect={false}
            showArrow={false}
          >
            <div className={styles.controls}>
              <Heading
                appearance={{ size: 'small', margin: 'none' }}
                text={MSG.title}
              />
              <Button
                appearance={{ theme: 'blue', size: 'small' }}
                text={MSG.selectSkill}
                textValues={{ skillSelected: selectedSkillId }}
              />
            </div>
          </ItemsList>
        )}
      </div>
    );
  }
}

export default TaskSkills;
