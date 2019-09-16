import { Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues, ENSName } from '~types/index';
import { ColonyRecord, FetchableDataRecord } from '~immutable/index';

export type AllColoniesMap = ImmutableMap<
  ENSName,
  FetchableDataRecord<ColonyRecord>
>;

export type AllColonyAvatarsMap = ImmutableMap<string, string>;

export type AllColonyNamesMap = ImmutableMap<
  Address,
  FetchableDataRecord<ENSName>
>;

export interface AllColoniesProps {
  avatars: AllColonyAvatarsMap;
  colonies: AllColoniesMap;
  colonyNames: AllColonyNamesMap;
}

const defaultValues: DefaultValues<AllColoniesProps> = {
  avatars: ImmutableMap(),
  colonies: ImmutableMap(),
  colonyNames: ImmutableMap(),
};

export class AllColoniesRecord extends Record<AllColoniesProps>(
  defaultValues,
) {}
