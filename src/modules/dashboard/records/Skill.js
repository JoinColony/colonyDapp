/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { SkillProps } from '~types';

const defaultValues: SkillProps = {
  id: 0,
  name: '',
  parent: undefined,
};

const Skill: RecordFactory<SkillProps> = Record(defaultValues);

export default Skill;
