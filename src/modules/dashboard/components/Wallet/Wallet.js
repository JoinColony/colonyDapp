/* @flow */

import { connect } from 'react-redux';
import { compose } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Wallet from './Wallet.jsx';

import { currentUserAddressSelector } from '../../../users/selectors';

const enhance = compose(
  withDialog(),
  connect(state => ({
    walletAddress: currentUserAddressSelector(state),
  })),
);

export default enhance(Wallet);
