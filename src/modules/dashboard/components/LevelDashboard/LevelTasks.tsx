import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import ListGroup, { ListGroupItem } from '~core/ListGroup';
import PayoutsList from '~core/PayoutsList';
import { SpinnerLoader } from '~core/Preloaders';
import {
  OneLevelWithUnlocked,
  useLevelTasksQuery,
  useColonyNativeTokenQuery,
} from '~data/index';
import { Address } from '~types/index';

import styles from './LevelTasks.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.LevelDashboard.LevelTasks.title',
    defaultMessage: 'Tasks',
  },
});

interface Props {
  colonyAddress: Address;
  levelId: OneLevelWithUnlocked['id'];
  unlocked: OneLevelWithUnlocked['unlocked'];
}

const displayName = 'dashboard.LevelDashboard.LevelTasks';

const LevelTasks = ({ colonyAddress, levelId, unlocked }: Props) => {
  const { data: levelTasksData } = useLevelTasksQuery({
    variables: { id: levelId },
  });
  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  if (!(levelTasksData && nativeTokenData)) {
    return <SpinnerLoader />;
  }
  const {
    level: { steps },
  } = levelTasksData;
  const {
    colony: { nativeTokenAddress },
  } = nativeTokenData;
  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
      <ListGroup>
        {steps.map(({ id: stepId, payouts, title }) => (
          <ListGroupItem key={stepId}>
            <div className={styles.item}>
              {!unlocked && (
                <div className={styles.locked}>
                  {/* @todo locked icon here */}
                </div>
              )}
              <div className={styles.content}>
                {title && (
                  <Heading
                    appearance={{ margin: 'none', size: 'normal' }}
                    text={title}
                  />
                )}
                {/* @todo domain & skill here */}
              </div>
              <div>
                <PayoutsList
                  nativeTokenAddress={nativeTokenAddress}
                  payouts={payouts}
                />
              </div>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

LevelTasks.displayName = displayName;

export default LevelTasks;
