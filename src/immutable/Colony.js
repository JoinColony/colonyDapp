/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import ColonyMeta from './ColonyMeta';
import Token from './Token';

import type { ColonyProps } from '~types';

const defaultValues: ColonyProps = {
  avatar: undefined,
  description: undefined,
  guideline: undefined,
  meta: ColonyMeta(),
  token: Token(),
  name: '',
  version: undefined,
  website: undefined,
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export default Colony;
