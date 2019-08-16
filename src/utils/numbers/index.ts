import BigNumber from 'bn.js';

type NumberLikeType = string | number | BigNumber;

/**
 * Multiply two number-like values, returning the result as a string.
 */
export const bnMultiply = (a: NumberLikeType, b: NumberLikeType) =>
  new BigNumber(a).mul(new BigNumber(b)).toString();

/**
 * Return whether `a` is less than `b` where each are number-like values.
 */
export const bnLessThan = (a: NumberLikeType, b: NumberLikeType) =>
  new BigNumber(a).lt(new BigNumber(b));
