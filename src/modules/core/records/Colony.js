/* @flow */

import type { RecordOf } from 'immutable';

import { Record } from 'immutable';

import ColonyMeta from './ColonyMeta';
import Token from './Token';

import type { ColonyProps, ColonyMetaRecord, TokenRecord } from '~types';

const defaultValues: ColonyProps = {
  avatar: undefined,
  description: undefined,
  guideline: undefined,
  meta: ColonyMeta(),
  token: Token(),
  name: '',
  version: undefined,
  website: undefined,
};

class ColonyClass extends Record(defaultValues)<ColonyProps> {
  // TODO ideally this class could implement an interface
  // rather than repeat these types from `ColonyProps`.
  avatar: string;

  description: string;

  guideline: string;

  meta: ColonyMetaRecord;

  name: string;

  token: TokenRecord;

  version: number;

  website: string;

  toStoreValues() {
    const { meta, token, name } = this;
    const { address, icon, name: tokenName, symbol } = token;
    return {
      meta: meta.toJS(),
      name,
      token: {
        address,
        icon,
        name: tokenName,
        symbol,
      },
    };
  }
}

const Colony = (props?: Object): RecordOf<ColonyProps> & ColonyClass =>
  new ColonyClass({ ...defaultValues, ...props });

export default Colony;
