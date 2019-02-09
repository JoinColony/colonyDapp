/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import type { TransactionRecord } from '~immutable';

import {
  transactionEstimateGas,
  transactionUpdateGas,
} from '../../../../core/actionCreators';
import { gasPrices as gasPricesSelector } from '../../../../core/selectors';
import GasStationPrice from './GasStationPrice.jsx';

type InProps = {
  transaction: TransactionRecord<*, *>,
};

const enhance: HOC<*, InProps> = compose(
  connect(
    state => ({
      gasPrices: gasPricesSelector(state),
    }),
    {
      estimateGas: transactionEstimateGas,
      updateGas: transactionUpdateGas,
    },
  ),
  withProps(({ gasPrices }) => {
    /*
     * @TODO: Actually determine if a tx requires any action with the wallet.
     * Also, union type here isn't necessary, just being used during mocking
     * to remind that `undefined` is possible
     */
    const walletNeedsAction: 'hardware' | 'metamask' | void = undefined;

    // @TODO: Actually determine whether the network is congested
    const isNetworkCongested = false;

    return {
      // TODO: Use immutable helper?
      gasPrices: gasPrices.toJS(),
      walletNeedsAction,
      isNetworkCongested,
    };
  }),
);

export default enhance(GasStationPrice);
