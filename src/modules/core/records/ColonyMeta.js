/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { ColonyMetaProps } from '~types';

const defaultValues: ColonyMetaProps = {
  address: '',
  ensName: '',
  id: 0,
};

const ColonyMeta: RecordFactory<ColonyMetaProps> = Record(defaultValues);

export default ColonyMeta;
