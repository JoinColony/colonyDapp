/* @flow */

import type { RecordFactory } from 'immutable';

import { Record } from 'immutable';

import type { DomainProps } from '~types';

const defaultValues: DomainProps = {
  id: 0,
  name: '',
};

const Domain: RecordFactory<DomainProps> = Record(defaultValues);

export default Domain;
