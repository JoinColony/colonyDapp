import { BigNumberish, bigNumberify } from 'ethers/utils';

/**
 * Return whether `a` is less than `b` where each are number-like values.
 */
export const bnLessThan = (a: BigNumberish, b: BigNumberish) =>
  bigNumberify(a).lt(bigNumberify(b));

export const halfPlusOne = (count: number) => Math.floor(count / 2) + 1;
export { formatTokenValue } from './formatTokenValue';
