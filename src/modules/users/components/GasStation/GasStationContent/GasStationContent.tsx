import React, { Component } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';

import { TransactionOrMessageGroups, isTxGroup } from '../transactionGroup';

import GasStationHeader from '../GasStationHeader';
import TransactionDetails from '../TransactionDetails';
import TransactionList from '../TransactionList';
import MessageCardDetails from '../MessageCardDetails';

import styles from './GasStationContent.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'users.GasStation.GasStationContent.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
});

export interface Appearance {
  /**
   * @NOTE Used to display the "Back to all transactions" link on the transaction's details view
   * Usefull for cases like the Create Colony Wizard Flow, were the transactions details view
   * is extracted out of the Gas Station, so you don't really have anywhere to go "back"
   */
  interactive?: boolean;

  /**
   * @NOTE Used to denote "important" transactions that shouldn't be cancelled
   * We use this to disable the "Cancel" link on Transactions, for those that we deem as
   * being important. Eg: The "Create Colony" group of transactions
   */
  required?: boolean;
}

interface Props {
  /* We don't want to show the header that shows the wallet address
   * if the gasStation is embedded in wizard step, the apperance object
   * helps with that
   */
  appearance: Appearance;
  close?: () => void;
  transactionAndMessageGroups: TransactionOrMessageGroups;
}

type State = {
  selectedGroupIdx: number;
};

class GasStationContent extends Component<Props, State> {
  // eslint-disable-next-line react/static-property-placement
  static displayName = 'users.GasStation.GasStationContent';

  // eslint-disable-next-line react/static-property-placement
  static defaultProps = {
    appearance: {
      interactive: true,
      required: false,
    },
  };

  state = {
    selectedGroupIdx: -1,
  };

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
      appearance,
    } = this.props;
    let detailsTransactionGroup = transactionAndMessageGroups[selectedGroupIdx];

    /*  If the GasStationContent is less interactive,
     * like in StepConfirmTransactions, we select the first group buy default
     */
    if (!interactive && selectedGroupIdx === -1) {
      [detailsTransactionGroup] = transactionAndMessageGroups;
    }

    if (detailsTransactionGroup || !interactive) {
      const isTx = isTxGroup(detailsTransactionGroup);
      if (isTx) {
        return (
          <TransactionDetails
            transactionGroup={detailsTransactionGroup}
            onClose={this.unselectTransactionGroup}
            appearance={appearance}
          />
        );
      }
      return (
        <MessageCardDetails
          message={detailsTransactionGroup[0]}
          onClose={this.unselectTransactionGroup}
        />
      );
    }
    return (
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
