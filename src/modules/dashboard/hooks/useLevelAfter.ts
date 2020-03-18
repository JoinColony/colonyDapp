import { useMemo } from 'react';

import { OneProgram } from '~data/index';

export const useLevelAfter = (
  program: OneProgram | undefined,
  currentLevelId: OneProgram['levels'][number]['id'] | undefined,
): OneProgram['levels'][number] | undefined => {
  const currentLevelIdx =
    program && currentLevelId && program.levelIds.indexOf(currentLevelId);
  const nextLevelId =
    typeof currentLevelIdx === 'number' &&
    currentLevelIdx >= 0 &&
    program &&
    program.levelIds[currentLevelIdx + 1];
  const nextLevel = useMemo(
    () => program && program.levels.find(({ id }) => id === nextLevelId),
    [nextLevelId, program],
  );
  return nextLevel;
};
