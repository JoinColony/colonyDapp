/* @flow */

import { connect } from 'react-redux';

import { transactionCancel } from '~redux/actionCreators';
import GroupedTransactionCard from './GroupedTransactionCard.jsx';

export default connect(
  null,
  {
    cancelTransaction: transactionCancel,
  },
)(GroupedTransactionCard);
