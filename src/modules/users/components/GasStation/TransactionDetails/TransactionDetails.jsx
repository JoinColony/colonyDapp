/* @flow */

import React from 'react';

import CardList from '~core/CardList';

import type { TransactionOrMessageGroup } from '../transactionGroup';
import type { Appearance } from '../GasStationContent';

import { getGroupKey, getActiveTransactionIdx } from '../transactionGroup';

import { GroupedTransaction } from '../TransactionCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';
import TransactionBackToList from './TransactionBackToList.jsx';

type Props = {|
  /* If we are only showing the transaction details
   * and no overview we do not need a back button
   */
  appearance: Appearance,
  transactionGroup: TransactionOrMessageGroup,
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
|};

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
    /*
     * @NOTE I think this is due to a prop name conflict between the Transaction
     * and Message objects but not really sure
     * Flow reports some iterator errors inside the core Flow and React libs
     */
    /* $FlowFixMe */
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
      {selectedTransaction && selectedTransaction.status === 'ready' && (
        <GasStationPrice transaction={selectedTransaction} />
      )}
    </div>
  );
};

TransactionDetails.displayName = displayName;

export default TransactionDetails;
