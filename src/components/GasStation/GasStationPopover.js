/* @flow */

import { connect } from 'react-redux';

import type { RootStateRecord } from '~immutable/state';

import GasStationPopover from './GasStationPopover.jsx';

import { groupedTransactions } from '~redux/selectors';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationPopover);
