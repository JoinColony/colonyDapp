/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

export type SkillProps = {
  id: number,
  name: string,
  parent?: number,
};

export type SkillRecord = RecordOf<SkillProps>;

const defaultValues: $Shape<SkillProps> = {
  id: undefined,
  name: undefined,
  parent: undefined,
};

const Skill: RecordFactory<SkillProps> = Record(defaultValues);

export default Skill;
