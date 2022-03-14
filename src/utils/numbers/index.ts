import { BigNumberish, bigNumberify } from 'ethers/utils';

export { numberDisplayFormatter } from './numberFormatter';
export { minimalFormatter } from './numberFormatter';
/**
 * Return whether `a` is less than `b` where each are number-like values.
 */
export const bnLessThan = (a: BigNumberish, b: BigNumberish) =>
  bigNumberify(a).lt(bigNumberify(b));

export const halfPlusOne = (count: number) => Math.floor(count / 2) + 1;
