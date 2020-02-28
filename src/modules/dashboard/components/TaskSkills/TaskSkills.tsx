import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import Heading from '~core/Heading';
import ItemsList from '~core/ItemsList';
import {
  AnyTask,
  useSetTaskSkillMutation,
  useRemoveTaskSkillMutation,
  cacheUpdates,
} from '~data/index';

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

interface Props {
  disabled?: boolean;
  draftId: AnyTask['id'];
  ethSkillId: number | void;
}

const displayName = 'daskboard.TaskSKills';

const TaskSkills = ({ draftId, disabled, ethSkillId }: Props) => {
  const [setSkill] = useSetTaskSkillMutation();
  const [removeSkill] = useRemoveTaskSkillMutation();

  const handleSetSkill = useCallback(
    ({ id }: { id: number; name: string }) =>
      setSkill({
        variables: {
          input: {
            id: draftId,
            ethSkillId: id,
          },
        },
        update: cacheUpdates.setTaskSkill(draftId),
      }),
    [draftId, setSkill],
  );

  const handleRemoveSkill = useCallback(
    ({ id }: { id: number; name: string }) =>
      removeSkill({
        variables: {
          input: {
            id: draftId,
            ethSkillId: id,
          },
        },
        update: cacheUpdates.removeTaskSkill(draftId),
      }),
    [draftId, removeSkill],
  );

  return (
    <div className={styles.main}>
      <ItemsList
        list={taskSkillsTree}
        handleSetItem={handleSetSkill}
        handleRemoveItem={handleRemoveSkill}
        name="taskSkills"
        connect={false}
        showArrow={false}
        itemId={ethSkillId || undefined}
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
              textValues={{ skillSelected: ethSkillId || undefined }}
            />
          )}
        </div>
      </ItemsList>
      {!ethSkillId ||
        /*
         * Prevent setting a negative index items
         */
        (ethSkillId < 0 && (
          <span className={styles.notSet}>
            <FormattedMessage {...MSG.notSet} />
          </span>
        ))}
    </div>
  );
};

TaskSkills.displayName = displayName;

export default TaskSkills;
