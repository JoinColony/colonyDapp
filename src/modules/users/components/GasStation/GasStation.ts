import { connect } from 'react-redux';

import GasStationContent from './GasStationContent';
import { RootStateRecord } from '~immutable/state';
import { groupedTransactions } from '../../../core/selectors';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationContent);
