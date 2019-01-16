/* @flow */
import type { HOC } from 'recompose';

import { compose, mapProps } from 'recompose';
import { connect } from 'react-redux';

import type { TransactionType } from '~types/transaction';

import { transactionGasManualSet as transactionGasManualSetAction } from '../../../../core/actionCreators';
import GasStationPrice from './GasStationPrice.jsx';

type InProps = {
  transaction: TransactionType,
};

const isDependencyBlockingTx = (
  set: Array<TransactionType>,
  dependency: string,
): boolean =>
  !set.find(({ hash, status }: TransactionType) => {
    if (hash === dependency) {
      return status && status !== 'succeeded';
    }
    return false;
  });

const statusCanBeSigned = (status?: string): boolean =>
  !status || status === 'failed' || status === 'created';

const enhance: HOC<*, InProps> = compose(
  connect(
    null,
    { transactionGasManualSet: transactionGasManualSetAction },
  ),
  mapProps(
    ({
      transaction: { dependents = [], status },
      transaction,
      transactionGasManualSet,
    }) => {
      /*
       * @TODO: Actually determine if network is congested
       */
      const isNetworkCongested: boolean = false;
      /*
       * @TODO: Actually determine if a tx requires any action with the wallet.
       * Also, union type here isn't necessary, just being used during mocking
       * to remind that `undefined` is possible
       */
      const walletNeedsAction: 'hardware' | 'metamask' | void = undefined;
      /*
       * A tx can only be signed if it meets the following criteria:
       *
       * 1. `walletNeedsAction` must not have a value.
       *
       * 2. If tx has a `set`, the `set` must contain a tx that either:
       *     a) does not have a `status`
       *     b) `status` === `failed`
       *   If a tx in the set satisfies either a or b and has a `dependency`,
       *   the tx in the set with `hex` === `dependency` must have `status` === `succeeded`
       *
       * 3. If the tx doesn't have a set, the tx must have
       *   no value for `status` or `status` === `failed`
       */
      const transactionToSign =
        dependents &&
        dependents.find(
          ({ dependency: setItemDependency, status: setItemStatus }) => {
            if (statusCanBeSigned(setItemStatus)) {
              if (!setItemDependency) {
                return true;
              }
              return isDependencyBlockingTx(dependents, setItemDependency);
            }
            return false;
          },
        );
      const canSignTransaction: boolean =
        !walletNeedsAction &&
        (dependents && dependents.length > 0
          ? !!transactionToSign
          : statusCanBeSigned(status));
      return {
        isNetworkCongested,
        walletNeedsAction,
        canSignTransaction,
        transaction: transactionToSign || transaction,
        transactionGasManualSet,
      };
    },
  ),
);

export default enhance(GasStationPrice);
