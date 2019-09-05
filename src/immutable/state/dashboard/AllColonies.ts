import { Map as ImmutableMap, RecordOf } from 'immutable';

import { Address, ENSName } from '~types/index';
import { ColonyRecord, DataRecordType } from '~immutable/index';

export type AllColoniesMap = ImmutableMap<
  ENSName,
  DataRecordType<ColonyRecord>
>;

export type AllColonyAvatarsMap = ImmutableMap<string, string>;

export type AllColonyNamesMap = ImmutableMap<Address, DataRecordType<ENSName>>;

export interface AllColoniesProps {
  avatars: AllColonyAvatarsMap;
  colonies: AllColoniesMap;
  colonyNames: AllColonyNamesMap;
}

export type AllColoniesRecord = RecordOf<AllColoniesProps>;
