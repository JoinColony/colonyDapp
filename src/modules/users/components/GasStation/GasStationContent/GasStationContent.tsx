import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import Heading from '~core/Heading';
import { getMainClasses } from '~utils/css';
import { TransactionType, MessageType } from '~immutable/index';

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
  /*
   * If we just created a transaction, auto open that transaction's details in
   * the gas station for signing (this removes an extra click from the flow)
   */
  autoOpenTransaction?: boolean;
  setAutoOpenTransaction?: (boolean) => void;
}

const displayName = 'users.GasStation.GasStationContent';

const GasStationContent = ({
  appearance: { interactive },
  appearance,
  close,
  transactionAndMessageGroups,
  autoOpenTransaction = false,
  setAutoOpenTransaction = () => {},
}: Props) => {
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(
    autoOpenTransaction ? 0 : -1,
  );

  const unselectTransactionGroup = () => {
    setSelectedGroupIdx(-1);
    setAutoOpenTransaction(false);
  };

  const selectTransactionGroup = (idx: number) => {
    setSelectedGroupIdx(idx);
  };

  const renderTransactions = () => {
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
            transactionGroup={detailsTransactionGroup as TransactionType[]}
            onClose={unselectTransactionGroup}
            appearance={appearance}
          />
        );
      }
      return (
        <MessageCardDetails
          message={detailsTransactionGroup[0] as MessageType}
          onClose={unselectTransactionGroup}
        />
      );
    }
    return (
      <TransactionList
        transactionAndMessageGroups={transactionAndMessageGroups}
        onClickGroup={selectTransactionGroup}
      />
    );
  };

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
          renderTransactions()
        )}
      </div>
    </div>
  );
};

GasStationContent.defaultProps = {
  appearance: {
    interactive: true,
    required: false,
  },
};

GasStationContent.displayName = displayName;

export default GasStationContent;
