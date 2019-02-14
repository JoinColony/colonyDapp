/* @flow */

import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withImmutablePropsToJS from 'with-immutable-props-to-js';

import { claimColonyToken } from '~redux/actionCreators';
import { withColonyTransactions } from '~redux/hocs';

import Transactions from './Transactions.jsx';

export default compose(
  connect(
    null,
    {
      claimColonyToken,
    },
  ),
  withColonyTransactions,
  withImmutablePropsToJS,
)(Transactions);
