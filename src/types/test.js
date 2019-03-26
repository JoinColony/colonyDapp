/* @flow */

import {
  Address,
  ENSName,
  type AddressType,
  type ENSNameType,
} from './strings';

const takesENSName = (arg: ENSNameType) => arg;
const takesAddress = (arg: AddressType) => arg;

const name = ENSName('ens name');
const address = Address('0x123');

takesENSName(name);
takesAddress(address);

/*
 * The following should produce flow errors:
 */
// Address('not a hex string');
// takesAddress('0x123'); // just a string
// takesENSName('just a string');
