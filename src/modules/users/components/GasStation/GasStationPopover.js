/* @flow */

import { connect } from 'react-redux';

import GasStationPopover from './GasStationPopover.jsx';

import { groupedTransactionsAndMessages } from '../../../core/selectors';

export default connect((state: Object) => ({
  transactionAndMessageGroups: groupedTransactionsAndMessages(state).toJS(),
}))(GasStationPopover);
