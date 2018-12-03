/* @flow */

import type { RecordOf } from 'immutable';

import type { TokenRecord, ColonyMetaRecord } from '~types';

export type ColonyProps = {
  avatar?: string,
  description?: string,
  guideline?: string,
  meta: ColonyMetaRecord,
  name: string,
  token: TokenRecord,
  version?: number,
  website?: string,
};

export type ColonyRecord = RecordOf<ColonyProps>;
