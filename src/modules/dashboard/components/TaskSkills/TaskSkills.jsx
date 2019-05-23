/* @flow */

// $FlowFixMe update flow
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { TaskProps } from '~immutable';

import { ACTIONS } from '~redux';
import { useAsyncFunction } from '~utils/hooks';
import { log } from '~utils/debug';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';

import styles from './TaskSkills.css';

import taskSkillsTree from './taskSkillsTree';

const MSG = defineMessages({
  notSet: {
    id: 'dashboard.TaskSkills.notSet',
    defaultMessage: 'Skill not set',
  },
  title: {
    id: 'dashboard.TaskSkills.title',
    defaultMessage: 'Skill',
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
  disabled?: boolean,
  ...TaskProps<{ draftId: *, colonyAddress: *, skillId: * }>,
|};

const displayName = 'daskboard.TaskSKills';

const TaskSkills = ({ colonyAddress, draftId, disabled, skillId }: Props) => {
  const setSkill = useAsyncFunction({
    submit: ACTIONS.TASK_SET_SKILL,
    success: ACTIONS.TASK_SET_SKILL_SUCCESS,
    error: ACTIONS.TASK_SET_SKILL_ERROR,
  });

  const handleSetSkill = useCallback(
    async (skillValue: Object) => {
      try {
        await setSkill({
          colonyAddress,
          draftId,
          skillId: skillValue.id,
        });
      } catch (caughtError) {
        /**
         * @todo Improve error modes for setting the task skill.
         */
        log.error(caughtError);
      }
    },
    [colonyAddress, draftId, setSkill],
  );

  return (
    <div className={styles.main}>
      <ItemsList
        list={taskSkillsTree}
        handleSetItem={handleSetSkill}
        name="taskSkills"
        connect={false}
        showArrow={false}
        itemId={skillId}
      >
        <div className={styles.controls}>
          <Heading
            appearance={{ size: 'small', margin: 'none' }}
            text={MSG.title}
          />
          {!disabled && (
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.selectSkill}
              textValues={{ skillSelected: skillId }}
            />
          )}
        </div>
      </ItemsList>
      {!skillId && (
        <span className={styles.notSet}>
          <FormattedMessage {...MSG.notSet} />
        </span>
      )}
    </div>
  );
};

TaskSkills.displayName = displayName;

export default TaskSkills;
