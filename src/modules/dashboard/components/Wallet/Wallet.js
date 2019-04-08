/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Wallet from './Wallet.jsx';

import { walletAddressSelector } from '../../../users/selectors';

const enhance = compose(
  withDialog(),
  connect(state => ({
    walletAddress: walletAddressSelector(state),
  })),
);

export default enhance(Wallet);
