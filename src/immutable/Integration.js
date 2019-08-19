/* @flow */

import type { RecordFactory, RecordOf } from 'immutable';

import { Record } from 'immutable';

type Shared = {|
  installed: boolean,
  name: string,
|};

export type IntegrationType = $ReadOnly<Shared>;

export type IntegrationRecordType = RecordOf<Shared>;

const defaultValues: $Shape<Shared> = {
  installed: false,
  name: undefined,
};

const IntegrationRecord: RecordFactory<Shared> = Record(defaultValues);

export default IntegrationRecord;
