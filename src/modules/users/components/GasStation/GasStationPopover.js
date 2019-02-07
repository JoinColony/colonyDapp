/* @flow */

import { connect } from 'react-redux';

import GasStationPopover from './GasStationPopover.jsx';

import { groupedTransactions } from '../../../core/selectors';

export default connect((state: Object) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationPopover);
