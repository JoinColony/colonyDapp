import { Map as ImmutableMap, Record } from 'immutable';
import { AnyColony } from '~data/index';

import { Address, DefaultValues, RecordToJS } from '~types/index';
import {
  ColonyRecord,
  FetchableDataRecord,
  FetchableDataType,
} from '~immutable/index';

import { DASHBOARD_COLONY_NAMES, DASHBOARD_COLONIES } from '../constants';

type AllColoniesObject = {
  [colonyAddress: string]: FetchableDataType<AnyColony>;
};

export type AllColoniesMap = ImmutableMap<
  Address,
  FetchableDataRecord<ColonyRecord>
> & { toJS(): AllColoniesObject };

type AllColonyNamesObject = {
  [nameOrAddress: string]: FetchableDataType<string>;
};

export type AllColonyNamesMap = ImmutableMap<
  string,
  FetchableDataRecord<string>
> & { toJS(): AllColonyNamesObject };

export interface AllColoniesProps {
  [DASHBOARD_COLONIES]: AllColoniesMap;
  [DASHBOARD_COLONY_NAMES]: AllColonyNamesMap;
}

const defaultValues: DefaultValues<AllColoniesProps> = {
  [DASHBOARD_COLONIES]: ImmutableMap() as AllColoniesMap,
  [DASHBOARD_COLONY_NAMES]: ImmutableMap() as AllColonyNamesMap,
};

export class AllColoniesRecord extends Record<AllColoniesProps>(defaultValues)
  implements
    RecordToJS<{
      [DASHBOARD_COLONIES]: AllColoniesObject;
      [DASHBOARD_COLONY_NAMES]: AllColonyNamesObject;
    }> {}
