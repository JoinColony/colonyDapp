/* @flow */

import type { RecordOf } from 'immutable';

import type { Address, ENSName } from '../lib/ColonyManager/types';

export type ColonyProps = {
  address: Address,
  avatar?: string,
  description?: string,
  guideline?: string,
  id?: number,
  label: string,
  name: ENSName,
  version?: number,
  website?: string,
};

export type ColonyRecord = RecordOf<ColonyProps>;
