/* @flow */

import React from 'react';

import CardList from '~core/CardList';

import TransactionCard from '../TransactionCard';
import MessageCard from '../MessageCard';

import type { TransactionOrMessageGroup } from '../transactionGroup';
import { getGroupId, isMessageGroup } from '../transactionGroup';

type Props = {
  transactionAndMessageGroups: Array<TransactionOrMessageGroup>,
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
        isMessageGroup(transactionOrMessageGroup) ? (
          <MessageCard
            key={getGroupId(transactionOrMessageGroup)}
            message={transactionOrMessageGroup[0]}
            onClick={onClickGroup}
            idx={idx}
          />
        ) : (
          <TransactionCard
            key={getGroupId(transactionOrMessageGroup)}
            transactionGroup={transactionOrMessageGroup}
            onClick={onClickGroup}
            idx={idx}
          />
        ),
    )}
  </CardList>
);

export default TransactionList;
