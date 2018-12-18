/* @flow */

import Token from './Token';
import makeDataClass from './makeDataClass';

import type { Address, ENSName } from '~types';
import type { TokenRecord } from './index';

export type ColonyProps = {|
  address: Address,
  avatar?: string,
  description?: string,
  ensName: ENSName,
  guideline?: string,
  id?: number,
  name: string,
  token?: TokenRecord,
  version?: number,
  website?: string,
|};

const defaultValues: ColonyProps = {
  address: '',
  avatar: undefined,
  description: undefined,
  ensName: '',
  guideline: undefined,
  id: undefined,
  name: '',
  token: Token(),
  version: undefined,
  website: undefined,
};

class ColonyClass extends makeDataClass<ColonyProps>(defaultValues) {
  /* eslint-disable */
  /*::
  address: Address;
  avatar: string;
  description: string;
  ensName: ENSName;
  guideline: string;
  id: number;
  name: string;
  token: TokenRecord;
  version: number;
  website: string;
  */
  /* eslint-enable */

  get isReady() {
    return !!(this.address && this.ensName && this.name && this.token);
  }
}

export type ColonyRecord = ColonyClass;

const Colony = (props?: ColonyProps) => new ColonyClass(props);

export default Colony;
