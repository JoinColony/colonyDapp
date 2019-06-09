/* @flow */

import React from 'react';

import CardList from '~core/CardList';

import TransactionCard from '../TransactionCard';
import MessageCard from '../MessageCard';

import type {
  TransactionOrMessageGroup,
  TransactionOrMessageGroups,
} from '../transactionGroup';
import { getGroupId, isTxGroup } from '../transactionGroup';

type Props = {
  transactionAndMessageGroups: TransactionOrMessageGroups,
  onClickGroup: (idx: number) => void,
};

const TransactionList = ({
  onClickGroup,
  transactionAndMessageGroups,
}: Props) => (
  <CardList
    appearance={{ numCols: '1' }}
    data-test="gasStationTransactionsList"
  >
    {transactionAndMessageGroups.map(
      (transactionOrMessageGroup: TransactionOrMessageGroup, idx: number) =>
        isTxGroup(transactionOrMessageGroup) ? (
          <TransactionCard
            key={getGroupId(transactionOrMessageGroup)}
            transactionGroup={transactionOrMessageGroup}
            onClick={onClickGroup}
            idx={idx}
          />
        ) : (
          <MessageCard
            key={getGroupId(transactionOrMessageGroup)}
            message={transactionOrMessageGroup[0]}
            onClick={onClickGroup}
            idx={idx}
          />
        ),
    )}
  </CardList>
);

export default TransactionList;
