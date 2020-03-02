import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Heading from '~core/Heading';
import Button from '~core/Button';
import PayoutsList from '~core/PayoutsList';
import { SpinnerLoader } from '~core/Preloaders';
import taskSkillsTree from '~dashboard/TaskSkills/taskSkillsTree';
import {
  OnePersistentTask,
  useColonyNativeTokenQuery,
  useDomainLazyQuery,
} from '~data/index';

import styles from './TaskDisplay.css';

const MSG = defineMessages({
  inDomain: {
    id: 'dashboard.LevelTasksEdit.TaskDisplay.inDomain',
    defaultMessage: 'in {domainName}',
  },
  untitledTask: {
    id: 'dashboard.LevelTasksEdit.TaskDisplay.untitledTask',
    defaultMessage: 'Untitled task',
  },
});

interface Props {
  persistentTask: OnePersistentTask;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const displayName = 'dashboard.LevelTasksEdit.TaskDisplay';

const TaskDisplay = ({
  persistentTask: {
    colonyAddress,
    description,
    ethDomainId,
    ethSkillId,
    payouts,
    title,
  },
  setIsEditing,
}: Props) => {
  const { data } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  const nativeTokenAddress = data && data.colony.nativeTokenAddress;
  const [
    fetchDomain,
    { data: domainData, loading: loadingDomain },
  ] = useDomainLazyQuery();
  const domainName = domainData && domainData.domain.name;

  useEffect(() => {
    // @todo default ethDomainId to root, always exists. Then use non-lazy query
    if (ethDomainId) {
      fetchDomain({ variables: { colonyAddress, ethDomainId } });
    }
  }, [colonyAddress, ethDomainId, fetchDomain]);

  const skillName = useMemo(
    () =>
      ethSkillId &&
      (taskSkillsTree.find(({ id }) => id === ethSkillId) || { name: '' }).name,
    [ethSkillId],
  );

  return (
    <div className={styles.main}>
      <div className={styles.headingContainer}>
        <Heading
          appearance={{ margin: 'none', size: 'normal' }}
          text={title || MSG.untitledTask}
        />
        <Button
          appearance={{ theme: 'blue' }}
          onClick={() => setIsEditing(val => !val)}
          text={{ id: 'button.edit' }}
        />
      </div>
      {description && <p className={styles.description}>{description}</p>}
      <div className={styles.rewardsContainer}>
        {nativeTokenAddress && (
          <div className={styles.rewardItem}>
            <PayoutsList
              nativeTokenAddress={nativeTokenAddress}
              payouts={payouts}
            />
          </div>
        )}
        {(loadingDomain || domainName) && (
          <div className={styles.rewardItem}>
            {loadingDomain && <SpinnerLoader />}
            {domainName && (
              <FormattedMessage {...MSG.inDomain} values={{ domainName }} />
            )}
          </div>
        )}
        {skillName && <div className={styles.rewardItem}>{skillName}</div>}
      </div>
    </div>
  );
};

TaskDisplay.displayName = displayName;

export default TaskDisplay;
