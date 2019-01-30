/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import CardList from '~core/CardList';

import styles from './TransactionDetails.css';

import type { TransactionGroup } from '../transactionGroup';

import { getGroupKey, getActiveTransaction } from '../transactionGroup';

import { GroupedTransaction } from '../TransactionCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStationPopover.GasStationContent.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = {
  username: string,
  transactionGroup: TransactionGroup,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
};

type State = {
  selectedTransactionIdx: number,
};

class TransactionDetails extends Component<Props, State> {
  static displayName = 'users.GasStation.TransactionDetails';

  constructor(props: Props) {
    super(props);
    this.state = {
      selectedTransactionIdx: getActiveTransaction(props.transactionGroup),
    };
  }

  render() {
    const { onClose, transactionGroup } = this.props;
    const { selectedTransactionIdx } = this.state;
    const selectedTransaction = transactionGroup[selectedTransactionIdx];
    const groupKey = getGroupKey(transactionGroup);
    return (
      <div>
        <button
          type="button"
          className={styles.returnToSummary}
          onClick={onClose}
        >
          <Icon
            appearance={{ size: 'small' }}
            name="caret-left"
            title={MSG.returnToSummary}
          />
          <FormattedMessage {...MSG.returnToSummary} />
        </button>
        <CardList appearance={{ numCols: '1' }}>
          {groupKey === 'network.registerUserLabel' && <GasStationClaimCard />}
          <GroupedTransaction
            transactionGroup={transactionGroup}
            selectedTransactionIdx={selectedTransactionIdx}
          />
        </CardList>
        {selectedTransaction && selectedTransaction.status === 'ready' && (
          <GasStationPrice transaction={selectedTransaction} />
        )}
      </div>
    );
  }
}

export default TransactionDetails;
