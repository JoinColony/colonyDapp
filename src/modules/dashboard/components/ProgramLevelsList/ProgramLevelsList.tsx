import React, { useMemo } from 'react';

import {
  OneProgram,
  levelsByIds,
  useProgramLevelsWithUnlockedQuery,
} from '~data/index';
import ListGroup, { ListGroupItem } from '~core/ListGroup';

import ProgramLevelsListItem from './ProgramLevelsListItem';

interface Props {
  program: OneProgram;
}

const displayName = 'dashboard.ProgramLevelsList';

const ProgramLevelsList = ({ program: { id: programId, enrolled } }: Props) => {
  const { data } = useProgramLevelsWithUnlockedQuery({
    variables: { id: programId },
  });

  const levelIds = (data && data.program.levelIds) || [];
  const unsortedLevels = (data && data.program.levels) || [];

  const levels = useMemo(() => unsortedLevels.sort(levelsByIds(levelIds)), [
    levelIds,
    unsortedLevels,
  ]);
  return (
    <ListGroup appearance={{ gaps: 'true' }}>
      {levels.map((level, idx) => (
        <ListGroupItem key={level.id}>
          <ProgramLevelsListItem
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
