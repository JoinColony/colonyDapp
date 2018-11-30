/* @flow */

import React, { Fragment, Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { InProps } from './GasStation';
import type { TransactionType } from '~types/transaction';

import { WALLET_ROUTE } from '~routes';

import { getMainClasses } from '~utils/css';
import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import Numeral from '~core/Numeral';
import CardList from '~core/CardList';

import GasStationCard from './GasStationCard';
import GasStationClaimCard from './GasStationClaimCard';

import styles from './GasStation.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'dashboard.GasStation.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
  goToWalletLinkTitle: {
    id: 'dashboard.GasStation.goToWalletLinkTitle',
    defaultMessage: 'Go to Wallet',
  },
  returnToSummary: {
    id: 'dashboard.GasStation.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = InProps & {
  balance: number,
  showClaimInfoCard: boolean,
  transactions: Array<TransactionType>,
  walletAddress: string,
};

type State = {
  expandedTransactionId: number,
};

class GasStation extends Component<Props, State> {
  static displayName = 'dashboard.GasStation';

  state = {
    expandedTransactionId: -1,
  };

  clearExpandedTrasaction() {
    return this.setState({ expandedTransactionId: -1 });
  }

  handleExpandTransaction(transactionIndex: number) {
    return this.setState({ expandedTransactionId: transactionIndex });
  }

  renderTransactionsSummary(
    transactions: Array<TransactionType>,
  ): Array<React$Element<*>> {
    return transactions.map(
      (transaction: TransactionType, transactionIndex: number) => (
        <GasStationCard
          /*
           * @NOTE Nonces are unique, but our mock data might add duplicates.
           * In case you see duplicate key errors in the console, don't panic.
           */
          key={transaction.nonce}
          transaction={transaction}
          onClick={() => this.handleExpandTransaction(transactionIndex)}
        />
      ),
    );
  }

  renderExpandedTransaction(transaction: TransactionType) {
    const { showClaimInfoCard } = this.props;
    return (
      <Fragment>
        <button
          type="button"
          className={styles.returnToSummary}
          onClick={() => this.clearExpandedTrasaction()}
        >
          <Icon
            appearance={{ size: 'small' }}
            name="caret-left"
            title={MSG.returnToSummary}
          />
          <FormattedMessage {...MSG.returnToSummary} />
        </button>
        {showClaimInfoCard && <GasStationClaimCard />}
        <GasStationCard transaction={transaction} expanded />
      </Fragment>
    );
  }

  render() {
    const { balance, close, transactions, walletAddress } = this.props;
    const { expandedTransactionId } = this.state;
    return (
      <div
        className={getMainClasses({}, styles, {
          isEmpty: transactions.length === 0,
        })}
      >
        <div className={styles.gasStationHeader}>
          <div className={styles.walletDetails}>
            <div className={styles.walletHeading}>
              <Heading
                appearance={{ margin: 'none', size: 'normal' }}
                text={{ id: 'wallet' }}
              />
            </div>
            <div className={styles.walletAddress}>
              <CopyableAddress>{walletAddress}</CopyableAddress>
            </div>
            <div>
              <Numeral value={balance} suffix="ETH" />
            </div>
          </div>
          <div className={styles.actionsContainer}>
            <Link to={WALLET_ROUTE}>
              <div className={styles.goToWalletIcon}>
                <Icon
                  appearance={{ size: 'medium' }}
                  name="arrow-wallet"
                  title={MSG.goToWalletLinkTitle}
                />
              </div>
            </Link>
            <button
              className={styles.closeButton}
              onClick={close}
              type="button"
            >
              <Icon
                appearance={{ size: 'normal' }}
                name="close"
                title={{ id: 'button.close' }}
              />
            </button>
          </div>
        </div>
        <div className={styles.transactionsContainer}>
          {transactions && transactions.length > 0 ? (
            <CardList appearance={{ numCols: '1' }}>
              {expandedTransactionId >= 0
                ? this.renderExpandedTransaction(
                    transactions[expandedTransactionId],
                  )
                : this.renderTransactionsSummary(transactions)}
            </CardList>
          ) : (
            <Heading
              appearance={{ margin: 'none', size: 'normal' }}
              text={MSG.transactionsEmptyStateText}
            />
          )}
        </div>
      </div>
    );
  }
}

export default GasStation;
