/* @flow */

import type { RecordOf } from 'immutable';

export type DomainProps = {
  id: number,
  name: string,
};

export type DomainRecord = RecordOf<DomainProps>;
