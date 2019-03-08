/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import type { TransactionGroup } from '../transactionGroup';

import GasStationHeader from '../GasStationHeader';
import GasStationFooter from '../GasStationFooter';
import TransactionDetails from '../TransactionDetails';
import TransactionList from '../TransactionList';

import styles from './GasStationContent.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'users.GasStation.GasStationContent.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
});

type Props = {|
  close?: () => void,
  getCurrentUserBalance: () => void,
  transactionGroups: Array<TransactionGroup>,
|};

type State = {|
  selectedGroupIdx: number,
|};

class GasStationContent extends Component<Props, State> {
  static displayName = 'users.GasStation.GasStationContent';

  state = {
    selectedGroupIdx: -1,
  };

  componentDidMount() {
    const { getCurrentUserBalance } = this.props;
    return getCurrentUserBalance();
  }

  unselectTransactionGroup = () => {
    this.setState({ selectedGroupIdx: -1 });
  };

  selectTransactionGroup = (idx: number) => {
    this.setState({ selectedGroupIdx: idx });
  };

  renderTransactions() {
    const { selectedGroupIdx } = this.state;
    const { transactionGroups } = this.props;
    const detailsTransactionGroup = transactionGroups[selectedGroupIdx];
    return detailsTransactionGroup ? (
      <TransactionDetails
        transactionGroup={detailsTransactionGroup}
        onClose={this.unselectTransactionGroup}
      />
    ) : (
      <TransactionList
        transactionGroups={transactionGroups}
        onClickGroup={this.selectTransactionGroup}
      />
    );
  }

  render() {
    const { close, transactionGroups } = this.props;
    const isEmpty = !transactionGroups || !transactionGroups.length;
    return (
      <div
        className={getMainClasses({}, styles, { isEmpty })}
        data-test="gasStation"
      >
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
        <GasStationFooter />
      </div>
    );
  }
}

export default GasStationContent;
