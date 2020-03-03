import React, { useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import PayoutsList from '~core/PayoutsList';
import {
  OneLevelWithUnlocked,
  OnePersistentTask,
  useDomainLazyQuery,
} from '~data/index';
import { Address } from '~types/index';

import styles from './LevelTasksListItem.css';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';

const MSG = defineMessages({
  domainText: {
    id: 'dashboard.LevelTasksList.LevelTasksListItem.domainText',
    defaultMessage: 'in {domainName}',
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
  persistentTask: { colonyAddress, ethDomainId, ethSkillId, payouts, title },
  unlocked,
}: Props) => {
  const [fetchDomain, { data: domainData }] = useDomainLazyQuery();
  useEffect(() => {
    if (ethDomainId) {
      fetchDomain({ variables: { ethDomainId, colonyAddress } });
    }
  }, [colonyAddress, ethDomainId, fetchDomain]);

  // @todo make a helper for this
  const skillName = useMemo(
    () =>
      ethSkillId &&
      (taskSkillsTree.find(({ id }) => id === ethSkillId) || { name: '' }).name,
    [ethSkillId],
  );
  return (
    <div className={styles.item}>
      {!unlocked && (
        <div className={styles.locked}>{/* @todo locked icon here */}</div>
      )}
      <div className={styles.content}>
        {title && (
          <Heading
            appearance={{ margin: 'none', size: 'normal' }}
            text={title}
          />
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
      <div>
        <PayoutsList
          nativeTokenAddress={nativeTokenAddress}
          payouts={payouts}
        />
      </div>
    </div>
  );
};

LevelTasksListItem.displayName = displayName;

export default LevelTasksListItem;
