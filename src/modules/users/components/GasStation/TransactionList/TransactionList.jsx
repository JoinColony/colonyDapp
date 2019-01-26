/* @flow */

import React from 'react';

import type { TransactionRecord } from '~immutable';

import CardList from '~core/CardList';

import GasStationCard from '../GasStationCard';

type Props = {
  transactions: Array<TransactionRecord<*, *>>,
  onClickTx: (idx: number) => void,
};

const TransactionList = ({ onClickTx, transactions }: Props) => (
  <CardList appearance={{ numCols: '1' }}>
    {transactions.map((transaction: TransactionRecord<*, *>, idx: number) => (
      <GasStationCard
        key={transaction.id}
        transaction={transaction}
        onClick={onClickTx}
        idx={idx}
      />
    ))}
  </CardList>
);

export default TransactionList;
