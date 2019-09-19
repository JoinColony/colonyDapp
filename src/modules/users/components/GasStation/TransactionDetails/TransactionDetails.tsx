import React, { MouseEvent } from 'react';

import { TRANSACTION_STATUSES, TransactionType } from '~immutable/index';
import CardList from '~core/CardList';
import { getGroupKey, getActiveTransactionIdx } from '../transactionGroup';
import { Appearance } from '../GasStationContent';
import { GroupedTransaction } from '../TransactionCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';
import TransactionBackToList from './TransactionBackToList';

const showPrice = (tx?: TransactionType) =>
  !!tx &&
  (tx.status === TRANSACTION_STATUSES.READY ||
    tx.status === TRANSACTION_STATUSES.FAILED);

interface Props {
  /* If we are only showing the transaction details
   * and no overview we do not need a back button
   */
  appearance: Appearance;
  transactionGroup: TransactionType[];
  onClose: (event: MouseEvent<HTMLButtonElement>) => void;
}

const displayName = 'users.GasStation.TransactionDetails';

const TransactionDetails = ({
  onClose,
  transactionGroup,
  appearance,
}: Props) => {
  const { interactive } = appearance;
  const selectedTransactionIdx = getActiveTransactionIdx(transactionGroup) || 0;
  const selectedTransaction = transactionGroup[selectedTransactionIdx];
  const groupKey = getGroupKey(transactionGroup);
  return (
    <div>
      {interactive && <TransactionBackToList onClose={onClose} />}
      <CardList appearance={{ numCols: '1' }}>
        {groupKey === 'network.registerUserLabel' && <GasStationClaimCard />}
        <GroupedTransaction
          appearance={appearance}
          transactionGroup={transactionGroup}
          selectedTransactionIdx={selectedTransactionIdx}
        />
      </CardList>
      {showPrice(selectedTransaction) && (
        <GasStationPrice transaction={selectedTransaction as TransactionType} />
      )}
    </div>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
