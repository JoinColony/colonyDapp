/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import type { TransactionRecord } from '~immutable';

import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import GasStationHeader from '../GasStationHeader';
import TransactionDetails from '../TransactionDetails';
import TransactionList from '../TransactionList';

import styles from './GasStationContent.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'users.GasStationPopover.GasStationContent.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
});

type Props = {
  close?: () => void,
  transactions: Array<TransactionRecord<*, *>>,
};

type State = {
  txDetailsIdx: number,
};

class GasStationContent extends Component<Props, State> {
  state = {
    txDetailsIdx: -1,
  };

  showList = () => {
    this.setState({ txDetailsIdx: -1 });
  };

  showTransaction = (idx: number) => {
    this.setState({ txDetailsIdx: idx });
  };

  renderTransactions() {
    const { txDetailsIdx } = this.state;
    const { transactions } = this.props;
    const detailsTransaction = transactions[txDetailsIdx];
    return detailsTransaction ? (
      <TransactionDetails
        transaction={detailsTransaction}
        onClose={this.showList}
      />
    ) : (
      <TransactionList
        transactions={transactions}
        onClickTx={this.showTransaction}
      />
    );
  }

  render() {
    const { close, transactions } = this.props;
    const isEmpty = !transactions || !transactions.length;
    return (
      <div className={getMainClasses({}, styles, { isEmpty })}>
        <GasStationHeader close={close} />
        <div className={styles.transactionsContainer}>
          {isEmpty ? (
            <Heading
              appearance={{ margin: 'none', size: 'normal' }}
              text={MSG.transactionsEmptyStateText}
            />
          ) : (
            this.renderTransactions()
          )}
        </div>
      </div>
    );
  }
}

export default GasStationContent;
