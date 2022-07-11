import React, { MouseEvent } from 'react';

import { TRANSACTION_STATUSES, TransactionType } from '~immutable/index';
import CardList from '~core/CardList';
import { getActiveTransactionIdx } from '../transactionGroup';
import { Appearance } from '../GasStationContent';
import { GroupedTransaction } from '../TransactionCard';
import GasStationControls from '../GasStationControls';
import MetaMaskWalletInteraction from '../MetaMaskWalletInteraction';
import TransactionBackToList from './TransactionBackToList';

const showPrice = (tx?: TransactionType) =>
  !!tx &&
  (tx.status === TRANSACTION_STATUSES.READY ||
    tx.status === TRANSACTION_STATUSES.FAILED);

const showInteraction = (tx?: TransactionType) =>
  !!tx && tx.status !== TRANSACTION_STATUSES.SUCCEEDED;

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
  return (
    <div>
      {interactive && <TransactionBackToList onClose={onClose} />}
      <CardList appearance={{ numCols: '1' }}>
        <GroupedTransaction
          appearance={appearance}
          transactionGroup={transactionGroup}
          selectedTransactionIdx={selectedTransactionIdx}
        />
      </CardList>
      {showPrice(selectedTransaction) && (
        <GasStationControls
          transaction={selectedTransaction as TransactionType}
        />
      )}
      {showInteraction(selectedTransaction) && (
        <MetaMaskWalletInteraction
          transactionType={
            selectedTransaction.metatransaction
              ? 'metatransaction'
              : 'transaction'
          }
        />
      )}
    </div>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
