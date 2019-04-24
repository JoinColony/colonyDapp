/* @flow */
import type { HOC } from 'recompose';

import { withImmutablePropsToJS } from '~utils/hoc';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import type { TransactionType } from '~immutable';

import {
  transactionEstimateGas,
  transactionUpdateGas,
} from '../../../../core/actionCreators';
import { gasPrices as gasPricesSelector } from '../../../../core/selectors';
import { currentUserBalanceSelector } from '../../../selectors';
import GasStationPrice from './GasStationPrice.jsx';

type InProps = {|
  transaction: TransactionType<*, *>,
|};

const enhance: HOC<*, InProps> = compose(
  connect(
    state => ({
      gasPrices: gasPricesSelector(state),
      balance: currentUserBalanceSelector(state),
    }),
    {
      estimateGas: transactionEstimateGas,
      updateGas: transactionUpdateGas,
    },
  ),
  withProps(({ gasPrices }) => {
    /**
     * @todo: Determine if a tx requires any action with the wallet (gas station)
     * @body Also, union type here isn't necessary, just being used during mocking
     * to remind that `undefined` is possible
     */
    const walletNeedsAction: 'hardware' | 'metamask' | void = undefined;

    /**
     * @todo Actually determine whether the network is congested (gas station)
     */
    const isNetworkCongested = false;

    return {
      // Use immutable helper? (or switch to hooks?)
      gasPrices: gasPrices.toJS(),
      walletNeedsAction,
      isNetworkCongested,
    };
  }),
  withImmutablePropsToJS,
);

export default enhance(GasStationPrice);
