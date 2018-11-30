/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { ColonyProps } from '~types/ColonyRecord';

const defaultValues: ColonyProps = {
  address: '',
  avatar: undefined,
  description: undefined,
  guideline: undefined,
  id: undefined,
  label: '',
  name: '',
  version: undefined,
  website: undefined,
};

const Colony: RecordFactory<ColonyProps> = Record(defaultValues);

export default Colony;
