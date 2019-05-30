/* @flow */

import React from 'react';

import CardList from '~core/CardList';

import TransactionCard from '../TransactionCard';
import MessageCard from '../MessageCard';

import type { TransactionGroup } from '../transactionGroup';
import { getGroupId } from '../transactionGroup';

type Props = {
  transactionGroups: Array<TransactionGroup>,
  onClickGroup: (idx: number) => void,
};

const TransactionList = ({ onClickGroup, transactionGroups }: Props) => (
  <CardList
    appearance={{ numCols: '1' }}
    data-test="gasStationTransactionsList"
  >
    {transactionGroups.map(
      (transactionGroup: TransactionGroup, idx: number) => (
        <TransactionCard
          key={getGroupId(transactionGroup)}
          transactionGroup={transactionGroup}
          onClick={onClickGroup}
          idx={idx}
        />
      ),
    )}
    <MessageCard />
  </CardList>
);

export default TransactionList;
