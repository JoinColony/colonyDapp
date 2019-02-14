/* @flow */

import { connect } from 'react-redux';

import type { RootStateRecord } from '~immutable/state';

import GasStationContent from './GasStationContent';

import { groupedTransactions } from '~redux/selectors';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationContent);
