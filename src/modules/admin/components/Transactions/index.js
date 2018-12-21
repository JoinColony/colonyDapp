/* @flow */

import { compose } from 'recompose';

import {
  withColonyTransactions,
  withColonyUnclaimedTransactions,
} from '../../hocs';

import Transactions from './Transactions.jsx';

export default compose(
  withColonyTransactions,
  withColonyUnclaimedTransactions,
)(Transactions);
