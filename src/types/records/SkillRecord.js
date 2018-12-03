/* @flow */

import type { RecordOf } from 'immutable';

export type SkillProps = {
  id: number,
  name: string,
  parent?: number,
};

export type SkillRecord = RecordOf<SkillProps>;
