/* @flow */

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import type { TransactionGroup } from '../transactionGroup';

import GasStationHeader from '../GasStationHeader';
import TransactionDetails from '../TransactionDetails';
import TransactionList from '../TransactionList';

import styles from './GasStationContent.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'users.GasStation.GasStationContent.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
});

export type Appearance = {
  interactive: boolean,
};

type Props = {|
  /* We don't want to show the header that shows the wallet address
   * if the gasStation is embedded in wizard step, the apperance object
   * helps with that
   */
  appearance: Appearance,
  close?: () => void,
  transactionAndMessageGroups: Array<TransactionGroup>,
  currentUserGetBalance: () => void,
|};

type State = {|
  selectedGroupIdx: number,
|};

class GasStationContent extends Component<Props, State> {
  static displayName = 'users.GasStation.GasStationContent';

  static defaultProps = {
    appearance: { interactive: true },
  };

  state = {
    selectedGroupIdx: -1,
  };

  componentDidMount() {
    const { currentUserGetBalance } = this.props;
    currentUserGetBalance();
  }

  unselectTransactionGroup = () => {
    this.setState({ selectedGroupIdx: -1 });
  };

  selectTransactionGroup = (idx: number) => {
    this.setState({ selectedGroupIdx: idx });
  };

  renderTransactions() {
    const { selectedGroupIdx } = this.state;
    const {
      transactionAndMessageGroups,
      appearance: { interactive },
    } = this.props;
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];

    /*  If the GasStationContent is less interactive,
     * like in StepConfirmTransactions, we select the first group buy default
     */
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    return detailsTransactionGroup || !interactive ? (
      <TransactionDetails
        transactionGroup={detailsTransactionGroup}
        onClose={this.unselectTransactionGroup}
        appearance={{ interactive: true }}
      />
    ) : (
      <TransactionList
        transactionAndMessageGroups={transactionAndMessageGroups}
        onClickGroup={this.selectTransactionGroup}
      />
    );
  }

  render() {
    const {
      close,
      transactionAndMessageGroups,
      appearance: { interactive },
    } = this.props;
    const isEmpty =
      !transactionAndMessageGroups || !transactionAndMessageGroups.length;
    return (
      <div
        className={getMainClasses({}, styles, { isEmpty })}
        data-test="gasStation"
      >
        {interactive && <GasStationHeader close={close} />}
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
