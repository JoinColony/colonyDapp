import { ethers } from 'ethers';
import { BigNumber, isHexString } from 'ethers/utils';
import { isAddress } from 'web3-utils';

const getMaxSafeUnsignedInteger = (input: string): BigNumber => {
  let bytes = input.substring(4);
  /* If input == 'uint', set to 256, since 'uint/int' is an alias of 'uint/int256'. */
  if (bytes === '') {
    bytes = '256';
  }
  const base = ethers.utils.bigNumberify(2);

  return base.pow(bytes).sub(1);
};

const getMaxSafeInteger = (input: string): BigNumber => {
  let bytes = input.substring(3);
  if (bytes === '') {
    bytes = '256';
  }

  /*
   * We're checking signed ints. Unsigned would be, e.g. 2**256 - 1.
   * Signed we have to check negatives, so it's (2 ** 256 / 2) - 1, which === 2 ** 255 - 1.
   */
  const exp = Number(bytes) - 1;
  const base = ethers.utils.bigNumberify(2);
  return base.pow(exp).sub(1);
};

const isUintSafe = (value: string, inputType: string) => {
  if (value === '' || value[0] === '-') {
    return false;
  }
  const max = getMaxSafeUnsignedInteger(inputType);
  let isSafe: boolean;
  try {
    isSafe = max.gte(value);
  } catch {
    isSafe = false;
  }
  return isSafe;
};

const isIntSafe = (value: string, inputType: string) => {
  if (value === '') {
    return false;
  }

  let isSafe: boolean;
  try {
    const max = getMaxSafeInteger(inputType);
    const val = ethers.utils.bigNumberify(value);
    isSafe = val.gte(0) ? max.gte(val) : max.mul(-1).lte(val);
  } catch {
    isSafe = false;
  }
  return isSafe;
};

const getArrayFromString = (array: string) => {
  if (array === '[]') {
    return [];
  }
  const vals = array.substring(1, array.length - 1);
  return vals.split(',');
};

const isAddressValid = (value: string) => {
  return isAddress(value);
};

const isValueArray = (value: string) => {
  return value[0] === '[' && value[value.length - 1] === ']';
};

const getBytesArrayLength = (input: string) => {
  let bytes = input.substring(5);
  /* "Prior to version 0.8.0, byte used to be an alias for bytes1." https://docs.soliditylang.org/en/v0.8.12/types.html */
  if (bytes === '') {
    bytes = '1';
  }

  const prefix = 2; // Byte arrays begin with 0x.
  // Every character is represented by 4 bits. Every byte holds 8 bits, therefore two characters represent 1 byte.
  const length = Number(bytes) * 2;
  return prefix + length;
};

const isByteArrayValid = (value: string, inputType: string) => {
  if (!isHexString(value)) {
    return false;
  }
  return value.length === getBytesArrayLength(inputType);
};

const isValidBoolean = (value: string) => {
  if (value === 'true' || value === 'false') {
    return true;
  }
  return false;
};

const isValidString = (value: string) => {
  return typeof value === 'string';
};

const isInputTypeArray = (inputType: string) => {
  return inputType.substring(inputType.length - 2) === '[]';
};

const typeFunctionMap: {
  [key: string]: (value: string, inputType: string) => boolean;
} = {
  uint: isUintSafe,
  int: isIntSafe,
  address: isAddressValid,
  byte: isByteArrayValid,
  bool: isValidBoolean,
  string: isValidString,
};

export const validateType = (
  inputType: string,
  value: string,
): boolean | number => {
  let type = inputType;
  const isArrayType = isInputTypeArray(inputType);
  if (isArrayType) {
    type = inputType.substring(0, inputType.length - 2);
  }

  const key = Object.keys(typeFunctionMap).find((t) => inputType.includes(t));

  // key should always be defined, since why else call this function?.
  if (!key) {
    return false;
  }

  const validationFn = typeFunctionMap[key];
  if (!isArrayType) {
    return validationFn(value, type);
  }

  if (!isValueArray(value)) {
    return -1;
  }

  const values = getArrayFromString(value);
  let failIdx: number;
  const allValuesSafe = values.every((val, idx) => {
    if (validationFn(val.trim(), type)) {
      return true;
    }
    failIdx = idx;
    return false;
  });
  if (allValuesSafe) {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return failIdx!; // If we get here, it means allSafe is false and failIdx was set.
};
