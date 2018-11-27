/* @flow */
import React from 'react';
import { defineMessages } from 'react-intl';
import nanoid from 'nanoid';

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
});

const displayName = 'dashboard.GasStation';

type Props = InProps & {
  balance: number,
  transactions: Array<TransactionType>,
  walletAddress: string,
};

const GasStation = ({ balance, close, transactions, walletAddress }: Props) => (
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
        <button className={styles.closeButton} onClick={close} type="button">
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
          {transactions.slice(2, 3).map((transaction: TransactionType) => (
            <GasStationCard
              /*
               * @NOTE I would like to create the id from the transaction's hash
               * rather than from the nonce.
               * Unfortunatelly nanoid doesn't play well with hex strings apparently...
               */
              key={nanoid(transaction.nonce)}
              transaction={transaction}
              onClick={
                transaction.set && transaction.set.length
                  ? event => console.log(event)
                  : undefined
              }
              expanded
            />
          ))}
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

GasStation.displayName = displayName;

export default GasStation;
