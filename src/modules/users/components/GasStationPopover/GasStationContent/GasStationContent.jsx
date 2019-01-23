/* @flow */

import React, { Fragment, Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { InProps } from './GasStationContent';
import type { TransactionType } from '~types';
import type { UserRecord } from '~immutable';

import { WALLET_ROUTE } from '~routes';

import { getMainClasses } from '~utils/css';
import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import Numeral from '~core/Numeral';
import CardList from '~core/CardList';

import GasStationCard from '../GasStationCard';
import GasStationClaimCard from '../GasStationClaimCard';
import GasStationPrice from '../GasStationPrice';

import styles from './GasStationContent.css';

const MSG = defineMessages({
  transactionsEmptyStateText: {
    id: 'users.GasStationPopover.GasStationContent.transactionsEmptyStateText',
    defaultMessage: 'You have no pending actions.',
  },
  goToWalletLinkTitle: {
    id: 'users.GasStationPopover.GasStationContent.goToWalletLinkTitle',
    defaultMessage: 'Go to Wallet',
  },
  returnToSummary: {
    id: 'users.GasStationPopover.GasStationContent.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = InProps & {
  balance: number,
  transactions: Array<TransactionType>,
  currentUser: UserRecord,
};

type State = {
  expandedTransactionIdx: number,
};

// TODO: This probably has to be improved later on
const txNotDone = (transaction: TransactionType) =>
  transaction.status !== 'succeeded' && transaction.status !== 'failed';

class GasStationContent extends Component<Props, State> {
  static displayName = 'users.GasStationPopover.GasStationContent';

  state = {
    expandedTransactionIdx: -1,
  };

  clearExpandedTrasaction() {
    return this.setState({ expandedTransactionIdx: -1 });
  }

  handleExpandTransaction(transactionIndex: number) {
    return this.setState({ expandedTransactionIdx: transactionIndex });
  }

  renderTransactionsSummary(
    transactions: Array<TransactionType>,
  ): Array<React$Element<*>> {
    return transactions.map(
      (transaction: TransactionType, transactionIndex: number) => (
        <GasStationCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => this.handleExpandTransaction(transactionIndex)}
        />
      ),
    );
  }

  renderExpandedTransaction(transaction: TransactionType) {
    const {
      currentUser: {
        profile: { username },
      },
    } = this.props;
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
        {!username && <GasStationClaimCard />}
        <GasStationCard transaction={transaction} expanded />
      </Fragment>
    );
  }

  render() {
    const {
      balance,
      close,
      transactions,
      currentUser: {
        profile: { walletAddress },
      },
    } = this.props;
    const { expandedTransactionIdx } = this.state;

    const expandedTx = transactions && transactions[expandedTransactionIdx];

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
              {expandedTx
                ? this.renderExpandedTransaction(expandedTx)
                : this.renderTransactionsSummary(transactions)}
            </CardList>
          ) : (
            <Heading
              appearance={{ margin: 'none', size: 'normal' }}
              text={MSG.transactionsEmptyStateText}
            />
          )}
        </div>
        {expandedTx && txNotDone(expandedTx) && (
          <div>
            <GasStationPrice transaction={expandedTx} />
          </div>
        )}
      </div>
    );
  }
}

export default GasStationContent;
