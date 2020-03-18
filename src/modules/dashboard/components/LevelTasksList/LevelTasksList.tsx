import React from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import ListGroup, { ListGroupItem } from '~core/ListGroup';
import { SpinnerLoader } from '~core/Preloaders';
import {
  OneLevelWithUnlocked,
  OneProgram,
  useColonyNativeTokenQuery,
} from '~data/index';
import { Address } from '~types/index';

import LevelTasksListItem from './LevelTasksListItem';

import styles from './LevelTasksList.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.LevelTasksList.title',
    defaultMessage: 'Tasks',
  },
});

interface Props {
  colonyAddress: Address;
  levelId: OneLevelWithUnlocked['id'];
  levelSteps: OneLevelWithUnlocked['steps'];
  programId: OneProgram['id'];
  unlocked: OneLevelWithUnlocked['unlocked'];
}

const displayName = 'dashboard.LevelTasksList';

const LevelTasksList = ({
  colonyAddress,
  levelId,
  levelSteps,
  programId,
  unlocked,
}: Props) => {
  const { data: nativeTokenData } = useColonyNativeTokenQuery({
    variables: { address: colonyAddress },
  });
  if (!nativeTokenData) {
    return <SpinnerLoader />;
  }
  const {
    colony: { nativeTokenAddress },
  } = nativeTokenData;
  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'medium' }} text={MSG.title} />
      <ListGroup>
        {levelSteps.map(persistentTask => (
          <ListGroupItem key={persistentTask.id}>
            <LevelTasksListItem
              levelId={levelId}
              nativeTokenAddress={nativeTokenAddress}
              persistentTask={persistentTask}
              programId={programId}
              unlocked={unlocked}
            />
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

LevelTasksList.displayName = displayName;

export default LevelTasksList;
