/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';
import CardList from '~core/CardList';

import styles from './TransactionDetails.css';

import type { TransactionGroup } from '../transactionGroup';

import { getGroupKey, getActiveTransactionIdx } from '../transactionGroup';

import { GroupedTransaction } from '../TransactionCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStationPopover.GasStationContent.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = {|
  /* If we are only showing the transaction details
   * and no overview we do not need a back button
   */
  hideInteractiveElements?: boolean,
  transactionGroup: TransactionGroup,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
|};

const displayName = 'users.GasStation.TransactionDetails';

const TransactionDetails = ({
  onClose,
  transactionGroup,
  hideInteractiveElements = false,
}: Props) => {
  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;
  const selectedTransaction = transactionGroup[selectedTransactionIdx];
  const groupKey = getGroupKey(transactionGroup);
  return (
    <div>
      {!hideInteractiveElements && (
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
      )}
      <CardList appearance={{ numCols: '1' }}>
        {groupKey === 'network.registerUserLabel' && <GasStationClaimCard />}
        <GroupedTransaction
          hideSummary={hideInteractiveElements}
          transactionGroup={transactionGroup}
          selectedTransactionIdx={selectedTransactionIdx}
        />
      </CardList>
      {selectedTransaction && selectedTransaction.status === 'ready' && (
        <GasStationPrice transaction={selectedTransaction} />
      )}
    </div>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
