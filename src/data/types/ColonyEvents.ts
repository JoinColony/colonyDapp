import { Address } from '~types/index';
import { ColonyProfileFragment } from '~data/index';

import { EventDefinition } from './events';
import { EventTypes, Versions } from '../constants';

export type ColonyEvents =
  | EventDefinition<
      EventTypes.COLONY_PROFILE_CREATED,
      Pick<
        ColonyProfileFragment,
        'colonyAddress' | 'colonyName' | 'displayName'
      >,
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.COLONY_PROFILE_UPDATED,
      Pick<
        ColonyProfileFragment,
        'description' | 'displayName' | 'guideline' | 'website'
      >,
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TASK_INDEX_STORE_REGISTERED,
      {
        taskIndexStoreAddress: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TOKEN_INFO_ADDED,
      {
        address: Address;
        iconHash?: string;
        isNative?: boolean;
        isExternal?: boolean;
        name?: string;
        symbol?: string;
      },
      Versions.CURRENT
    >
  | EventDefinition<
      EventTypes.TOKEN_INFO_REMOVED,
      {
        address: Address;
      },
      Versions.CURRENT
    >;
