/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { TaskProps } from '~immutable';
import type { AsyncFunction } from '../../../../createPromiseListener';

import promiseListener from '../../../../createPromiseListener';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import { ACTIONS } from '~redux';

import styles from './TaskSkills.css';

import taskSkills from './taskSkillsTree';

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

type Props = {|
  isTaskCreator: boolean,
  ...TaskProps<{ draftId: *, colonyENSName: *, skillId: * }>,
|};

class TaskSkills extends Component<Props> {
  asyncFunc: AsyncFunction<Object, void>;

  static displayName = 'dashboard.TaskSkills';

  constructor(props: Props) {
    super(props);

    this.asyncFunc = promiseListener.createAsyncFunction({
      start: ACTIONS.TASK_SET_SKILL,
      resolve: ACTIONS.TASK_SET_SKILL_SUCCESS,
      reject: ACTIONS.TASK_SET_SKILL_ERROR,
    });
  }

  componentWillUnmount() {
    this.asyncFunc.unsubscribe();
  }

  handleSetSkill = async (skillValue: Object) => {
    const { draftId, colonyENSName } = this.props;
    try {
      await this.asyncFunc.asyncFunction({
        colonyENSName,
        draftId,
        skillId: skillValue.id,
      });
    } catch (error) {
      // TODO: handle this error properly / display it in some way
      console.error(error);
    }
  };

  render() {
    const { isTaskCreator, skillId } = this.props;
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
