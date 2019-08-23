import { $ReadOnly } from 'utility-types';

import { RecordOf, Record } from 'immutable';

interface Shared {
  id: number;
  name: string;
  // Empty if root, but we don't actually store root domain yet anyway
  parentId?: number;
}

export type DomainType = $ReadOnly<Shared>;

export type DomainRecordType = RecordOf<Shared>;

export type DomainId = DomainRecordType['id'];

const defaultValues: Shared = {
  id: undefined,
  name: undefined,
  parentId: undefined,
};

export const DomainRecord: Record.Factory<Shared> = Record(defaultValues);

export default DomainRecord;
