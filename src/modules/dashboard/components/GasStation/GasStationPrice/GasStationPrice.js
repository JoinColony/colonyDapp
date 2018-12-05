/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';

import type { TransactionType } from '~types/transaction';

import GasStationPrice from './GasStationPrice.jsx';

type InProps = {
  transaction: TransactionType,
};

const statusCanBeSigned = (status?: string): boolean =>
  !status || status === 'failed';

const dependencyIsBlocker = (
  set: Array<TransactionType>,
  dependency: string,
): boolean =>
  !!set.find(({ hash, status }: TransactionType) => {
    if (hash === dependency) {
      return status && status !== 'succeeded';
    }
    return false;
  });

const enhance: HOC<*, InProps> = compose(
  withProps(() => ({
    /*
     * @TODO: Actually determine if a tx requires any action with the wallet.
     */
    walletNeedsAction: 'hardware',
  })),
  withProps(({ transaction: { set, status, symbol }, walletNeedsAction }) => {
    /*
     * A tx can only be signed if it meets the following criteria:
     *
     * 1. `walletNeedsAction` must not have a value.
     *
     * 2. If it has a `set`, the `set` must contain a tx that either:
     *     a) does not have a `status`
     *     b) `status` === `failed` 
     *   If a tx in the set satisfies either a or b and has a `dependency`,
     *   the tx in the set with `hex` === `dependency` must have `status` === `succeeded`
     *
     * 3. If the tx doesn't have a set, the tx must have
     *   no value for `status` or `status` === `failed`
     */
    const requiresSignature =
      !walletNeedsAction &&
      (set && set.length > 0
        ? !!set.find(
            ({ dependency: setItemDependency, status: setItemStatus }) => {
              if (statusCanBeSigned(setItemStatus)) {
                if (!setItemDependency) {
                  return true;
                }
                return !dependencyIsBlocker(set, setItemDependency);
              }
              return false;
            },
          )
        : statusCanBeSigned(status));
    return {
      txGasCostsEth: {
        cheaper: 0.1,
        cheaperWait: 12000,
        faster: 0.05,
        fasterWait: 2300,
        suggested: 0.2,
        suggestedWait: 8640,
      },
      isEth: symbol.toLowerCase() === 'eth',
      isNetworkCongested: false,
      walletNeedsAction,
      requiresSignature,
    };
  }),
);

export default enhance(GasStationPrice);
