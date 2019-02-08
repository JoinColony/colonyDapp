/* @flow */
import type { HOC } from 'recompose';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  currentUserAddressSelector,
  currentUserBalanceSelector,
} from '../../../selectors';

import GasStationHeader from './GasStationHeader.jsx';

const enhance: HOC<*, {}> = compose(
  connect((state: Object) => ({
    walletAddress: currentUserAddressSelector(state),
    balance: currentUserBalanceSelector(state),
  })),
);

export default enhance(GasStationHeader);
