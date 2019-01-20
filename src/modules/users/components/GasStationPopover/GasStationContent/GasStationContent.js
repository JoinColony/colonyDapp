/* @flow */
import type { HOC } from 'recompose';

import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

import { currentUserAddressSelector } from '../../../selectors';

import GasStationContent from './GasStationContent.jsx';

export type InProps = {
  close: () => void,
};

const enhance: HOC<*, InProps> = compose(
  connect((state: Object) => ({
    walletAddress: currentUserAddressSelector(state),
  })),
  withProps(() => ({
    balance: 0.25,
  })),
);

export default enhance(GasStationContent);
