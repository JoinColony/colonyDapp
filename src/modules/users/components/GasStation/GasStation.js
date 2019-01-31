/* @flow */

import { connect } from 'react-redux';

import GasStationContent from './GasStationContent';

import { groupedTransactions } from '../../../core/selectors';

export default connect((state: Object) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationContent);
