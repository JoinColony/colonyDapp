import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import Button from '~core/Button';
import { Form, Input, Textarea, Select } from '~core/Fields';
import { OnePersistentTask, useEditPersistentTaskMutation } from '~data/index';

import styles from './TaskEdit.css';

const MSG = defineMessages({
  buttonDeleteTask: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.buttonDeleteTask',
    defaultMessage: 'Delete task',
  },
  labelTaskDescription: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.labelTaskDescription',
    defaultMessage: 'Task Description',
  },
  labelTaskDomain: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.labelTaskDomain',
    defaultMessage: 'Domain',
  },
  labelTaskPayout: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.labelTaskPayout',
    defaultMessage: 'Payout',
  },
  labelTaskSkill: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.labelTaskSkill',
    defaultMessage: 'Skill (optional)',
  },
  labelTaskTitle: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.labelTaskTitle',
    defaultMessage: 'Task Title',
  },
});

interface Props {
  persistentTask: OnePersistentTask;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

interface FormValues {
  title: string;
  description?: string;
  domainId?: string;
  skillId?: string;
  amount: string;
  tokenAddress: string;
}

const validationSchema = yup.object().shape({
  amount: yup
    .number()
    .moreThan(0)
    .required(),
  description: yup.string().required(),
  domainId: yup
    .number()
    .moreThan(0)
    .required(),
  skillId: yup
    .number()
    .moreThan(0)
    .nullable(),
  title: yup.string().required(),
  tokenAddress: yup
    .string()
    .address()
    .required(),
});

const displayName = 'dashboard.LevelTasksEdit.TaskEdit';

const TaskEdit = ({
  persistentTask: {
    id: persistentTaskId,
    description,
    ethDomainId,
    ethSkillId,
    payouts,
    title = '',
  },
  setIsEditing,
}: Props) => {
  const [editPersistentTask] = useEditPersistentTaskMutation();
  // Only support one payout for now
  const { amount, tokenAddress } = payouts[0] || {
    amount: '',
    tokenAddress: '',
  };

  const handleSubmit = useCallback(
    async ({
      description: descriptionVal,
      domainId,
      skillId,
      title: titleVal,
    }: FormValues) => {
      await editPersistentTask({
        variables: {
          input: {
            description: descriptionVal,
            ethDomainId: domainId ? parseInt(domainId, 10) : undefined,
            ethSkillId: skillId ? parseInt(skillId, 10) : undefined,
            id: persistentTaskId,
            title: titleVal,
          },
        },
      });
      setIsEditing(val => !val);
    },
    [editPersistentTask, persistentTaskId, setIsEditing],
  );
  return (
    <Form
      initialValues={
        {
          amount,
          description,
          title,
          domainId: ethDomainId,
          skillId: ethSkillId,
          tokenAddress,
        } as FormValues
      }
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <div className={styles.section}>
        <Input
          appearance={{ colorSchema: 'grey', theme: 'fat' }}
          label={MSG.labelTaskTitle}
          name="title"
        />
        <Textarea
          appearance={{
            colorSchema: 'grey',
            resizable: 'vertical',
            theme: 'fat',
          }}
          label={MSG.labelTaskDescription}
          name="description"
        />
      </div>
      <div className={styles.section}>
        <Select
          appearance={{ theme: 'grey' }}
          label={MSG.labelTaskDomain}
          name="domainId"
          options={[]}
        />
      </div>
      <div className={styles.section}>
        <Select
          appearance={{ theme: 'grey' }}
          label={MSG.labelTaskSkill}
          name="skillId"
          options={[]}
        />
      </div>
      {/* @todo payout */}
      <div className={styles.section}>
        <div className={styles.actionsRow}>
          <div>
            <Button
              appearance={{ theme: 'dangerLink' }}
              text={MSG.buttonDeleteTask}
            />
          </div>
          <div>
            <Button
              appearance={{ theme: 'secondary' }}
              onClick={() => setIsEditing(val => !val)}
              text={{ id: 'button.cancel' }}
            />
            <Button text={{ id: 'button.save' }} type="submit" />
          </div>
        </div>
      </div>
    </Form>
  );
};

TaskEdit.displayName = displayName;

export default TaskEdit;
