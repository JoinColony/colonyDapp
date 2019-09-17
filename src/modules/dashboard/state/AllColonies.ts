import { Map as ImmutableMap, Record } from 'immutable';

import { Address, DefaultValues, ENSName } from '~types/index';
import { ColonyRecord, FetchableDataRecord } from '~immutable/index';

import { DASHBOARD_COLONY_NAMES, DASHBOARD_COLONIES } from '../constants';

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
  [DASHBOARD_COLONIES]: AllColoniesMap;
  [DASHBOARD_COLONY_NAMES]: AllColonyNamesMap;
}

const defaultValues: DefaultValues<AllColoniesProps> = {
  [DASHBOARD_COLONIES]: ImmutableMap(),
  [DASHBOARD_COLONY_NAMES]: ImmutableMap(),
};

export class AllColoniesRecord extends Record<AllColoniesProps>(
  defaultValues,
) {}
