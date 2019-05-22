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
import {
  currentUserBalanceSelector,
  walletTypeSelector,
} from '../../../selectors';
import GasStationPrice from './GasStationPrice.jsx';

type InProps = {|
  transaction: TransactionType<*, *>,
|};

const enhance: HOC<*, InProps> = compose(
  connect(
    state => ({
      gasPrices: gasPricesSelector(state),
      balance: currentUserBalanceSelector(state),
      walletType: walletTypeSelector(state),
    }),
    {
      estimateGas: transactionEstimateGas,
      updateGas: transactionUpdateGas,
    },
  ),
  withProps(({ gasPrices, walletType }) => {
    /**
     * @todo Actually determine whether the network is congested (gas station).
     */
    const isNetworkCongested = false;

    return {
      // Use immutable helper? (or switch to hooks?)
      gasPrices: gasPrices.toJS(),
      walletNeedsAction: walletType !== 'software' ? walletType : undefined,
      isNetworkCongested,
    };
  }),
  withImmutablePropsToJS,
);

export default enhance(GasStationPrice);
