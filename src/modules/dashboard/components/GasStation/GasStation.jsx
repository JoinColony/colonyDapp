/* @flow */
import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import type { InProps } from './GasStation';
import type { TransactionType } from '~types/transaction';

import { WALLET_ROUTE } from '~routes';

import { getMainClasses } from '~utils/css';
import CardList from '~core/CardList';
import CopyableAddress from '~core/CopyableAddress';
import Heading from '~core/Heading';
import Icon from '~core/Icon';
import Link from '~core/Link';
import Numeral from '~core/Numeral';

import styles from './GasStation.css';

import GasStationClaimCard from '~dashboard/GasStationClaimCard';

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

type Props = InProps & {
  balance: number,
  showClaimInfoCard: boolean,
  transactions: Array<TransactionType>,
  walletAddress: string,
};

const GasStation = ({
  balance,
  close,
  showClaimInfoCard,
  transactions,
  walletAddress,
}: Props) => (
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
          <Fragment>
            {showClaimInfoCard && <GasStationClaimCard />}
            {/* @TODO: Transaction card list for issue
              #472 https://github.com/JoinColony/colonyDapp/issues/472 */}
          </Fragment>
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

export default GasStation;
