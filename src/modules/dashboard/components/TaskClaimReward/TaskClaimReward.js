/* @flow */

import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';
import { sortObjectsBy } from '~utils/arrays';

import TaskClaimReward from './TaskClaimReward.jsx';

export type Props = {
  /*
   * We're not putting a custom defined type on this since it all likeliness it
   * will change
   */
  taskReward: Object,
  taskTitle: string,
};

/*
 * This should most likely come from the redux state, so we can compare against
 * the tasks's payouts
 */
const MOCK_NATIVE_TOKEN_SYMBOL: string = 'CLNY';

const isNative = ({ symbol }: Object): boolean =>
  symbol === MOCK_NATIVE_TOKEN_SYMBOL;

const isEth = (prev: string, next: string): number => {
  const prevVal = prev.toLowerCase();
  const nextVal = next.toLowerCase();
  if (prevVal === 'eth' || nextVal === 'eth') {
    return prevVal === 'eth' ? -1 : 1;
  }
  return 0;
};

const networkFee = ({ amount, symbol }) => ({
  amount,
  symbol,
  networkFee: amount * 0.01,
});

const enhance = compose(
  withDialog(),
  withProps(({ taskReward: { payoutsEarned = [] } = {} }: Props) => {
    /*
     * Calculate the network fee
     */
    const payoutsWithFee = payoutsEarned.map(networkFee);
    return {
      sortedPayouts: payoutsWithFee
        /*
         * Take out the native token
         */
        .filter(payout => !isNative(payout))
        /*
         * Sort ETH to the top
         */
        .sort(sortObjectsBy({ name: 'symbol', compareFn: isEth }, 'symbol')),
      nativeTokenPayout: payoutsWithFee
        /*
         * See if we have a native token
         */
        .find(isNative),
    };
  }),
);

export default enhance(TaskClaimReward);
