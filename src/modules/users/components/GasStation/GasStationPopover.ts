import { connect } from 'react-redux';
import { RootStateRecord } from '~immutable/state';

// @ts-ignore
import GasStationPopover from './GasStationPopover.tsx';

import { groupedTransactionsAndMessages } from '../../../core/selectors';

export default connect((state: RootStateRecord) => ({
  transactionAndMessageGroups: groupedTransactionsAndMessages(state).toJS(),
}))(GasStationPopover);
