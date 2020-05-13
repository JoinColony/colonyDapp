import { BigNumberish, bigNumberify } from 'ethers/utils';

/**
 * Return whether `a` is less than `b` where each are number-like values.
 */
export const bnLessThan = (a: BigNumberish, b: BigNumberish) =>
  bigNumberify(a).lt(bigNumberify(b));
