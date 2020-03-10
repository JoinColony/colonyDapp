import React, { KeyboardEvent, useEffect, useMemo, useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import PayoutsList from '~core/PayoutsList';
import PersistentTaskSubmitWorkDialog from '~dashboard/PersistentTaskSubmitWorkDialog';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';
import {
  OneLevelWithUnlocked,
  OnePersistentTask,
  SubmissionStatus,
  useDomainLazyQuery,
  OneLevel,
} from '~data/index';
import { Address, ENTER } from '~types/index';

import styles from './LevelTasksListItem.css';

const MSG = defineMessages({
  domainText: {
    id: 'dashboard.LevelTasksList.LevelTasksListItem.domainText',
    defaultMessage: 'in {domainName}',
  },
  statusCompleteText: {
    id: 'dashboard.LevelTasksList.LevelTasksListItem.statusCompleteText',
    defaultMessage: 'Complete',
  },
  statusPendingText: {
    id: 'dashboard.LevelTasksList.LevelTasksListItem.statusPendingText',
    defaultMessage: 'Pending review',
  },
  titleLocked: {
    id: 'dashboard.LevelTasksList.LevelTasksListItem.titleLocked',
    defaultMessage: 'Locked',
  },
});

interface Props {
  levelId: OneLevel['id'];
  nativeTokenAddress: Address;
  persistentTask: OnePersistentTask;
  unlocked: OneLevelWithUnlocked['unlocked'];
}

const displayName = 'dashboard.LevelTasksList.LevelTasksListItem';

const LevelTasksListItem = ({
  levelId,
  nativeTokenAddress,
  persistentTask: {
    colonyAddress,
    currentUserSubmission,
    ethDomainId,
    ethSkillId,
    payouts,
    title,
  },
  persistentTask,
  unlocked,
}: Props) => {
  const isSubmissionAccepted =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Accepted;
  const isSubmissionPending =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Open;
  const [fetchDomain, { data: domainData }] = useDomainLazyQuery();

  const openDialog = useDialog(PersistentTaskSubmitWorkDialog);

  const handleClick = useCallback(() => {
    // Can't use `pointer-events: none` css because of `PayoutsList` child
    if (unlocked) {
      openDialog({
        levelId,
        persistentTask,
      });
    }
  }, [levelId, openDialog, persistentTask, unlocked]);

  const handleKeyDown = useCallback(
    (evt: KeyboardEvent<HTMLDivElement>) => {
      // Can't use `pointer-events: none` css because of `PayoutsList` child
      if (evt.key === ENTER && unlocked) {
        openDialog({
          levelId,
          persistentTask,
        });
      }
    },
    [levelId, openDialog, persistentTask, unlocked],
  );

  useEffect(() => {
    if (ethDomainId) {
      fetchDomain({ variables: { ethDomainId, colonyAddress } });
    }
  }, [colonyAddress, ethDomainId, fetchDomain]);

  const skillName = useMemo(
    () =>
      ethSkillId &&
      (taskSkillsTree.find(({ id }) => id === ethSkillId) || { name: '' }).name,
    [ethSkillId],
  );
  return (
    <div
      aria-disabled={!unlocked}
      className={styles.item}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={unlocked ? 0 : -1}
    >
      {!unlocked && (
        <div className={styles.locked}>
          <Icon name="lock" title={MSG.titleLocked} />
        </div>
      )}
      <div className={styles.content}>
        <div className={styles.headingContainer}>
          <Heading
            appearance={{
              margin: 'none',
              size: 'normal',
              theme: !isSubmissionAccepted ? 'dark' : undefined,
            }}
            text={title || { id: 'levelStep.untitled' }}
          />
          {isSubmissionAccepted && (
            <Icon
              className={styles.iconComplete}
              name="circle-check-primary"
              title={MSG.statusCompleteText}
              viewBox="0 0 21 22"
            />
          )}
        </div>
        <div className={styles.categories}>
          {domainData && (
            <div className={styles.category}>
              <FormattedMessage
                {...MSG.domainText}
                values={{ domainName: domainData.domain.name }}
              />
            </div>
          )}
          {skillName && <div className={styles.category}>{skillName}</div>}
        </div>
      </div>
      <div className={styles.rewardsContainer}>
        <div className={styles.payoutsContainer}>
          <PayoutsList
            clickDisabled={unlocked}
            nativeTokenAddress={nativeTokenAddress}
            payouts={payouts}
          />
        </div>
        {isSubmissionPending && (
          <div className={styles.pendingText}>
            <Heading
              appearance={{ margin: 'none', size: 'small' }}
              text={MSG.statusPendingText}
            />
            <div className={styles.dot} />
          </div>
        )}
      </div>
    </div>
  );
};

LevelTasksListItem.displayName = displayName;

export default LevelTasksListItem;
