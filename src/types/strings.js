/* @flow */

import * as yup from 'yup';

type HexString = $CharSet<'abcdefx0123456789'>;

export opaque type AddressType: HexString = string;

export opaque type ENSNameType: string = string;

const ensNameSchema = yup
  .string()
  .ensAddress()
  .required();

const addressSchema = yup
  .string()
  .address()
  .required();

/*
 * Create a validated ENSNameType.
 */
export const ENSName = (name: string): ENSNameType => {
  if (!ensNameSchema.validateSync(name))
    throw new Error(`Expected a valid ENS name, received "${name}"`);
  return name;
};

/*
 * Create a validated AddressType.
 */
export const Address = (address: HexString): AddressType => {
  if (!addressSchema.validateSync(address))
    throw new Error(`Expected a valid address, received "${address}"`);
  return address;
};
