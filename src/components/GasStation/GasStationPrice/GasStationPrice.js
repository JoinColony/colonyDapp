/* @flow */
import type { HOC } from 'recompose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import type { TransactionType } from '~immutable';

import {
  transactionEstimateGas,
  transactionUpdateGas,
} from '~redux/actionCreators';
import { gasPrices as gasPricesSelector } from '~redux/selectors';
import GasStationPrice from './GasStationPrice.jsx';

type InProps = {|
  transaction: TransactionType<*, *>,
|};

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
  withImmutablePropsToJS,
);

export default enhance(GasStationPrice);
