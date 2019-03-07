/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Wallet from './Wallet.jsx';

import { userTokenTransfersFetch } from '../../../users/actionCreators';
import {
  currentUserAddressSelector,
  currentUserTransactionsSelector,
} from '../../../users/selectors';

const enhance = compose(
  withDialog(),
  withProps(() => ({
    // TODO: fetch from current user record
    tokens: [].splice(1, 0, {
      address: '0x0000000000000000000000000000000000000000',
    }),
  })),
  connect(
    state => ({
      walletAddress: currentUserAddressSelector(state),
      transactions: currentUserTransactionsSelector(state),
    }),
    {
      userTokenTransfersFetch,
    },
  ),
);

export default enhance(Wallet);
