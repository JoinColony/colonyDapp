import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Button from '~core/Button';
import { Form } from '~core/Fields';
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

interface FormValues {
  taskSkills?: number | null;
}

interface Props {
  disabled?: boolean;
  draftId: AnyTask['id'];
  ethSkillId: number | void;
}

const displayName = 'daskboard.TaskSKills';

const TaskSkills = ({ draftId, disabled, ethSkillId }: Props) => {
  const [setSkill] = useSetTaskSkillMutation();
  const [removeSkill] = useRemoveTaskSkillMutation();

  const handleOnSubmit = useCallback(
    ({ taskSkills }: FormValues) => {
      if (ethSkillId && taskSkills === null) {
        removeSkill({
          variables: {
            input: {
              id: draftId,
              ethSkillId,
            },
          },
          update: cacheUpdates.removeTaskSkill(draftId),
        });
      } else if (taskSkills) {
        setSkill({
          variables: {
            input: {
              id: draftId,
              ethSkillId: taskSkills,
            },
          },
          update: cacheUpdates.setTaskSkill(draftId),
        });
      }
    },
    [draftId, ethSkillId, removeSkill, setSkill],
  );

  return (
    <div className={styles.main}>
      <Form
        initialValues={{ taskSkills: ethSkillId || undefined }}
        onSubmit={handleOnSubmit}
      >
        {({ submitForm }) => (
          <>
            <ItemsList
              list={taskSkillsTree}
              name="taskSkills"
              showArrow={false}
              disabled={disabled}
              onChange={submitForm}
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
          </>
        )}
      </Form>
    </div>
  );
};

TaskSkills.displayName = displayName;

export default TaskSkills;
