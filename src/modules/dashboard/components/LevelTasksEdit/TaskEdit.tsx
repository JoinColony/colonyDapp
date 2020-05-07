import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import * as yup from 'yup';
import { ROOT_DOMAIN_ID } from '@colony/colony-js';

import Button from '~core/Button';
import { useDialog, ConfirmDialog } from '~core/Dialog';
import { AmountTokens, Form, Input, Select, Textarea } from '~core/Fields';
import { SelectOption } from '~core/Fields/Select/types';
import { SpinnerLoader } from '~core/Preloaders';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';
import {
  cacheUpdates,
  OneLevel,
  OnePersistentTask,
  useColonyTokensQuery,
  useEditPersistentTaskMutation,
  useRemoveLevelTaskMutation,
  useLoggedInUser,
} from '~data/index';
import { useDataFetcher } from '~utils/hooks';

import { domainsAndRolesFetcher } from '../../fetchers';
import { canFund } from '../../../users/checks';

import styles from './TaskEdit.css';

const MSG = defineMessages({
  buttonDeleteTask: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.buttonDeleteTask',
    defaultMessage: 'Delete task',
  },
  confirmDeleteHeading: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.confirmDeleteHeading',
    defaultMessage: 'Delete task',
  },
  confirmDeleteText: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.confirmDeleteText',
    defaultMessage: 'Are you sure you would like to delete this task?',
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
  selectOptionNoSkill: {
    id: 'dashboard.LevelTasksEdit.TaskEdit.selectOptionNoSkill',
    defaultMessage: 'None',
  },
});

interface Props {
  levelId: OneLevel['id'];
  persistentTask: OnePersistentTask;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

interface FormValues {
  title: string;
  description?: string;
  domainId: string;
  skillId?: string;
  amount: string;
  tokenAddress: string;
}

const validationSchema = yup.object().shape({
  amount: yup.number().moreThan(0).required(),
  description: yup.string().nullable(),
  domainId: yup.number().moreThan(0).required(),
  skillId: yup.number().nullable(),
  title: yup.string().required(),
  tokenAddress: yup.string().address().required(),
});

const displayName = 'dashboard.LevelTasksEdit.TaskEdit';

const TaskEdit = ({
  levelId,
  persistentTask: {
    id: persistentTaskId,
    colonyAddress,
    description,
    ethDomainId,
    ethSkillId,
    payouts,
    title = '',
  },
  setIsEditing,
}: Props) => {
  const openDialog = useDialog(ConfirmDialog);
  const { walletAddress } = useLoggedInUser();

  const { data: colonyTokensData } = useColonyTokensQuery({
    variables: { address: colonyAddress },
  });

  const { data: domains, isFetching: isFetchingDomains } = useDataFetcher(
    domainsAndRolesFetcher,
    [colonyAddress],
    [colonyAddress],
  );

  const domainOptions = useMemo<SelectOption[]>(
    () =>
      domains
        ? Object.keys(domains).map((key) => {
            const { id, name, roles } = domains[key];
            const { roles: rootRoles } = domains[ROOT_DOMAIN_ID];
            const userRolesInDomain = roles[walletAddress] || [];
            const userRolesInRoot = rootRoles[walletAddress] || [];
            return {
              disabled: !(
                canFund(userRolesInRoot) || canFund(userRolesInDomain)
              ),
              label: name,
              value: id.toString(),
            };
          })
        : [],
    [domains, walletAddress],
  );

  const skillOptions = useMemo<SelectOption[]>(
    () => [
      { label: MSG.selectOptionNoSkill, value: '' },
      ...taskSkillsTree.map(({ id, name, parent }) => ({
        label: parent ? `- ${name}` : name,
        value: id.toString(),
      })),
    ],
    [],
  );

  const [editPersistentTask] = useEditPersistentTaskMutation();
  const [removeLevelTask] = useRemoveLevelTaskMutation({
    update: cacheUpdates.removeLevelTask(levelId),
    variables: { input: { id: persistentTaskId, levelId } },
  });
  // Only support one payout for now
  const { amount, tokenAddress } = payouts[0] || {
    amount: '',
    tokenAddress: '',
  };

  const handleDelete = useCallback(async () => {
    await openDialog({
      appearance: { theme: 'danger' },
      heading: MSG.confirmDeleteHeading,
      children: <FormattedMessage {...MSG.confirmDeleteText} />,
      confirmButtonText: { id: 'button.delete' },
    }).afterClosed();
    removeLevelTask();
  }, [openDialog, removeLevelTask]);

  const handleSubmit = useCallback(
    async ({
      amount: amountVal,
      description: descriptionVal,
      domainId,
      skillId,
      title: titleVal,
      tokenAddress: tokenAddressVal,
    }: FormValues) => {
      await editPersistentTask({
        variables: {
          input: {
            description: descriptionVal,
            ethDomainId: parseInt(domainId, 10),
            ethSkillId: skillId ? parseInt(skillId, 10) : null,
            id: persistentTaskId,
            payouts:
              amountVal && tokenAddressVal
                ? [{ amount: amountVal, tokenAddress: tokenAddressVal }]
                : [],
            title: titleVal,
          },
        },
      });
      setIsEditing((val) => !val);
    },
    [editPersistentTask, persistentTaskId, setIsEditing],
  );

  if (!colonyTokensData || isFetchingDomains) {
    return (
      <div className={styles.section}>
        <div className={styles.centered}>
          <SpinnerLoader appearance={{ size: 'large' }} />
        </div>
      </div>
    );
  }

  const {
    colony: { nativeTokenAddress, tokens },
  } = colonyTokensData;
  return (
    <Form
      initialValues={
        {
          amount,
          description: description || '',
          title: title || '',
          domainId:
            typeof ethDomainId === 'number'
              ? ethDomainId.toString()
              : ROOT_DOMAIN_ID.toString(),
          skillId:
            typeof ethSkillId === 'number' ? ethSkillId.toString() : ethSkillId,
          tokenAddress: tokenAddress || nativeTokenAddress,
        } as FormValues
      }
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ dirty, isValid, values }) => (
        <>
          <div className={styles.section}>
            <Input
              appearance={{ colorSchema: 'grey', theme: 'fat' }}
              label={MSG.labelTaskTitle}
              maxLength={90}
              name="title"
              id={`task-${persistentTaskId}-title`}
            />
            <Textarea
              appearance={{
                colorSchema: 'grey',
                resizable: 'vertical',
                theme: 'fat',
              }}
              label={MSG.labelTaskDescription}
              name="description"
              maxLength={4000}
              id={`task-${persistentTaskId}-description`}
            />
          </div>
          <div className={styles.section}>
            <div className={styles.narrow}>
              <Select
                appearance={{ theme: 'grey' }}
                label={MSG.labelTaskDomain}
                name="domainId"
                options={domainOptions}
                id={`task-${persistentTaskId}-domainId`}
              />
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.narrow}>
              <Select
                appearance={{ theme: 'grey' }}
                label={MSG.labelTaskSkill}
                name="skillId"
                options={skillOptions}
                id={`task-${persistentTaskId}-skillId`}
              />
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.narrow}>
              <AmountTokens
                label={MSG.labelTaskPayout}
                nameAmount="amount"
                nameToken="tokenAddress"
                selectedTokenAddress={values.tokenAddress}
                tokens={tokens}
                id={`task-${persistentTaskId}-payouts`}
              />
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.actionsRow}>
              <div>
                <Button
                  appearance={{ theme: 'dangerLink' }}
                  onClick={handleDelete}
                  text={MSG.buttonDeleteTask}
                />
              </div>
              <div>
                <Button
                  appearance={{ theme: 'secondary' }}
                  onClick={() => setIsEditing((val) => !val)}
                  text={{ id: 'button.cancel' }}
                />
                <Button
                  disabled={!dirty || !isValid}
                  text={{ id: 'button.save' }}
                  type="submit"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </Form>
  );
};

TaskEdit.displayName = displayName;

export default TaskEdit;
