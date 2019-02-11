/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  id: number,
  name: string,
  parent?: number,
|};

export type SkillType = $ReadOnly<Shared>;

export type SkillRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  id: undefined,
  name: undefined,
  parent: undefined,
};

const SkillRecord: RecordFactory<Shared> = Record(defaultValues);

export default SkillRecord;
