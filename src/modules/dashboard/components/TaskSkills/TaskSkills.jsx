/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskSkills.css';

import skillMocks from './__datamocks__/mockSkills';

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
};

type State = {
  selectedSkillId: number | void,
};

class TaskSkills extends Component<Props, State> {
  static displayName = 'dashboard.TaskSkills';

  state = {
    selectedSkillId: undefined,
  };

  handleSetSkill = (skillValue: Object) => {
    this.setState({ selectedSkillId: skillValue.id });
    /*
     * @TODO This should call (most likely) an action creator, or otherwise,
     * do something the domain value
     */
    /* eslint-disable-next-line no-console */
    return console.log(TaskSkills.displayName, skillValue);
  };

  render() {
    const { isTaskCreator } = this.props;
    const { selectedSkillId } = this.state;
    const list = Array(...skillMocks);
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
