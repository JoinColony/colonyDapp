/* @flow */

import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';

import withDialog from '~core/Dialog/withDialog';

import Wallet from './Wallet.jsx';

import { fetchUserTransactions } from '../../../users/actionCreators';
import {
  currentUserAddressSelector,
  currentUserTransactions,
} from '../../../users/selectors';

import mockTokens from '../../../../__mocks__/mockTokens';

const enhance = compose(
  withDialog(),
  withProps(() => ({
    tokens: mockTokens,
  })),
  connect(
    state => ({
      walletAddress: currentUserAddressSelector(state),
      transactions: currentUserTransactions(state),
    }),
    {
      fetchUserTransactions,
    },
  ),
);

export default enhance(Wallet);
