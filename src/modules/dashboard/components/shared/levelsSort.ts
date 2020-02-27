import { OneLevel, OneProgram } from '~data/index';

export const sortLevelsByIds = (levelIds: OneProgram['levelIds']) => (
  { id: idA }: OneLevel,
  { id: idB }: OneLevel,
) => levelIds.indexOf(idA) - levelIds.indexOf(idB);
