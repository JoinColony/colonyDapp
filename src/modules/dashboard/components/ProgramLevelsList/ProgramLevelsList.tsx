import React, { useMemo } from 'react';

import { OneProgram, useProgramLevelsWithUnlockedQuery } from '~data/index';
import ListGroup, { ListGroupItem } from '~core/ListGroup';

import ProgramLevelsListItem from './ProgramLevelsListItem';
import { sortLevelsByIds } from '../shared/levelsSort';

interface Props {
  colonyName: string;
  program: OneProgram;
}

const displayName = 'dashboard.ProgramLevelsList';

const ProgramLevelsList = ({
  colonyName,
  program: { id: programId, enrolled },
}: Props) => {
  const { data } = useProgramLevelsWithUnlockedQuery({
    variables: { id: programId },
  });

  const levelIds = (data && data.program.levelIds) || [];
  const unsortedLevels = (data && data.program.levels) || [];

  const levels = useMemo(() => unsortedLevels.sort(sortLevelsByIds(levelIds)), [
    levelIds,
    unsortedLevels,
  ]);
  return (
    <ListGroup appearance={{ gaps: 'true' }}>
      {levels.map((level, idx) => (
        <ListGroupItem key={level.id}>
          <ProgramLevelsListItem
            colonyName={colonyName}
            index={idx}
            isUserEnrolled={enrolled}
            level={level}
          />
        </ListGroupItem>
      ))}
    </ListGroup>
  );
};

ProgramLevelsList.displayName = displayName;

export default ProgramLevelsList;
