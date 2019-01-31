/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { currentUserAddressSelector } from '../../../selectors';

import GasStationHeader from './GasStationHeader.jsx';

const enhance: HOC<*, {}> = compose(
  connect((state: Object) => ({
    walletAddress: currentUserAddressSelector(state),
  })),
  withProps(() => ({
    balance: 0.25,
  })),
);

export default enhance(GasStationHeader);
