/* @flow */

import type { RecordOf } from 'immutable';

import type { Address, ENSName } from '~types';

export type ColonyMetaProps = {
  address: Address,
  ensName: ENSName,
  id: number,
};

export type ColonyMetaRecord = RecordOf<ColonyMetaProps>;
