import { connect } from 'react-redux';

// @ts-ignore
import GasStationPopover from './GasStationPopover.tsx';

import { RootStateRecord } from '../../../state';
import { groupedTransactionsAndMessages } from '../../../core/selectors';

export default connect((state: RootStateRecord) => ({
  transactionAndMessageGroups: groupedTransactionsAndMessages(state).toJS(),
}))(GasStationPopover);
