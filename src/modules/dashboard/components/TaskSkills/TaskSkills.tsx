import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { TaskProps } from '~immutable/index';
import { ActionTypes } from '~redux/index';
import { useAsyncFunction } from '~utils/hooks';
import { log } from '~utils/debug';
import Heading from '~core/Heading';
import Button from '~core/Button';
import ItemsList from '~core/ItemsList';
import taskSkillsTree from './taskSkillsTree';
import styles from './TaskSkills.css';

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

interface Props extends TaskProps<'draftId' | 'colonyAddress' | 'skillId'> {
  disabled?: boolean;
}

const displayName = 'daskboard.TaskSKills';

const TaskSkills = ({ colonyAddress, draftId, disabled, skillId }: Props) => {
  const setSkill = useAsyncFunction({
    submit: ActionTypes.TASK_SET_SKILL,
    success: ActionTypes.TASK_SET_SKILL_SUCCESS,
    error: ActionTypes.TASK_SET_SKILL_ERROR,
  });

  const handleSetSkill = useCallback(
    async (skillValue: any) => {
      try {
        await setSkill({
          colonyAddress,
          draftId,
          skillId: skillValue ? skillValue.id : undefined,
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
        disabled={disabled}
        nullable
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
      {!skillId ||
        /*
         * Prevent setting a negative index items
         */
        (skillId < 0 && (
          <span className={styles.notSet}>
            <FormattedMessage {...MSG.notSet} />
          </span>
        ))}
    </div>
  );
};

TaskSkills.displayName = displayName;

export default TaskSkills;
