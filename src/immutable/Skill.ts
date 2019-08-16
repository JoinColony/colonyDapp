import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

type Shared = {
  id: number;
  name: string;
  parent?: number;
};

export type SkillType = $ReadOnly<Shared>;

export type SkillRecordType = RecordOf<Shared>;

const defaultValues: Shared = {
  id: undefined,
  name: undefined,
  parent: undefined,
};

export const SkillRecord: Record.Factory<Shared> = Record(defaultValues);

export default SkillRecord;
