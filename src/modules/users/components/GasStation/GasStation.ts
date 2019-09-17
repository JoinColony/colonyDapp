import { connect } from 'react-redux';

import { RootStateRecord } from '../../../state';
import { groupedTransactions } from '../../../core/selectors';
import GasStationContent from './GasStationContent';

export default connect((state: RootStateRecord) => ({
  transactionGroups: groupedTransactions(state).toJS(),
}))(GasStationContent);
