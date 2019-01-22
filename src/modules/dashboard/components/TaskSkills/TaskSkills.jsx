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

import type { TaskRecord } from '~immutable';

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
  // After the skillId is set with the TaskSkills component it should be passed
  // through form the redux store and is property of the TaskRecord
  task: TaskRecord,
};

class TaskSkills extends Component<Props> {
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

  componentWillUnmount() {
    this.asyncFunc.unsubscribe();
  }

  handleSetSkill = async (skillValue: Object) => {
    const {
      task: { id, colonyENSName, domainId },
    } = this.props;
    try {
      await this.asyncFunc.asyncFunction({
        skillId: skillValue.id,
        domainId,
        // taskId of currently selected task
        id,
        ensName: colonyENSName,
      });
    } catch (error) {
      // TODO: handle this error properly / display it in some way
      console.error(error);
    }
  };

  render() {
    const {
      isTaskCreator,
      task: { skillId },
    } = this.props;
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
                textValues={{ skillSelected: skillId }}
              />
            </div>
          </ItemsList>
        )}
      </div>
    );
  }
}

export default TaskSkills;
