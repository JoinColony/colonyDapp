import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import PayoutsList from '~core/PayoutsList';
import {
  OneLevelWithUnlocked,
  OnePersistentTask,
  SubmissionStatus,
  useDomainLazyQuery,
} from '~data/index';
import { Address } from '~types/index';

import styles from './LevelTasksListItem.css';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';
import Icon from '~core/Icon';

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
  nativeTokenAddress: Address;
  persistentTask: OnePersistentTask;
  unlocked: OneLevelWithUnlocked['unlocked'];
}

const displayName = 'dashboard.LevelTasksList.LevelTasksListItem';

const LevelTasksListItem = ({
  nativeTokenAddress,
  persistentTask: {
    colonyAddress,
    currentUserSubmission,
    ethDomainId,
    ethSkillId,
    payouts,
    title,
  },
  unlocked,
}: Props) => {
  const isSubmissionAccepted =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Accepted;
  const isSubmissionPending =
    currentUserSubmission &&
    currentUserSubmission.status === SubmissionStatus.Open;
  const [fetchDomain, { data: domainData }] = useDomainLazyQuery();
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
    <div className={styles.item}>
      {!unlocked && (
        <div className={styles.locked}>
          <Icon name="lock" title={MSG.titleLocked} />
        </div>
      )}
      <div className={styles.content}>
        {title && (
          <div className={styles.headingContainer}>
            <Heading
              appearance={{
                margin: 'none',
                size: 'normal',
                theme: !isSubmissionAccepted ? 'dark' : undefined,
              }}
              text={title}
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
        )}
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
