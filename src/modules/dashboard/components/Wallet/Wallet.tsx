import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { useDialog } from '~core/Dialog';
import CopyableAddress from '~core/CopyableAddress';
import Button from '~core/Button';
import Heading from '~core/Heading';
import QRCode from '~core/QRCode';
import WalletLink from '~core/WalletLink';
import TokenList from '~admin/Tokens/TokenList';
import { useLoggedInUser, useUserTokensQuery } from '~data/index';

import UserTokenEditDialog from './UserTokenEditDialog';

import styles from './Wallet.css';

const MSG = defineMessages({
  tabTokens: {
    id: 'dashboard.Wallet.tabTokens',
    defaultMessage: 'Tokens',
  },
  tabTransactions: {
    id: 'dashboard.Wallet.tabTransactions',
    defaultMessage: 'Transactions',
  },
  titleWallet: {
    id: 'dashboard.Wallet.titleWallet',
    defaultMessage: 'Wallet',
  },
  helpText: {
    id: 'dashboard.Wallet.helpText',
    defaultMessage: "Don't see the tokens you are looking for?",
  },
  linkText: {
    id: 'dashboard.Wallet.linkText',
    defaultMessage: 'View your transactions on Etherscan {link}',
  },
  linkEditToken: {
    id: 'dashboard.Wallet.linkEditToken',
    defaultMessage: 'Edit tokens',
  },
  linkViewTransactions: {
    id: 'dashboard.Wallet.linkViewTransactions',
    defaultMessage: 'Here',
  },
});

const Wallet = () => {
  const { walletAddress } = useLoggedInUser();
  const openDialog = useDialog(UserTokenEditDialog);
  const { data: userTokensData, loading: loadingTokens } = useUserTokensQuery({
    variables: { address: walletAddress },
  });
  const tokens = userTokensData ? userTokensData.user.tokens : [];
  const editTokens = useCallback(() => openDialog({ walletAddress }), [
    openDialog,
    walletAddress,
  ]);
  return (
    <div className={styles.layoutMain}>
      <main className={styles.content}>
        <div className={styles.walletDetails}>
          <QRCode address={walletAddress} width={55} />
          <div className={styles.address}>
            <Heading
              text={MSG.titleWallet}
              appearance={{ size: 'medium', margin: 'small' }}
            />
            <CopyableAddress appearance={{ theme: 'big' }} full>
              {walletAddress}
            </CopyableAddress>
          </div>
        </div>
        <TokenList
          isLoading={loadingTokens}
          tokens={tokens}
          appearance={{ numCols: '3' }}
        />
      </main>
      <aside className={styles.sidebar}>
        <p className={styles.helpText}>
          <FormattedMessage {...MSG.helpText} />
          <br />
          <br />
          <Button
            appearance={{ theme: 'blue', size: 'small' }}
            text={MSG.linkEditToken}
            onClick={editTokens}
          />
        </p>
        <p className={styles.linkText}>
          <FormattedMessage
            {...MSG.linkText}
            values={{
              link: (
                <WalletLink
                  className={styles.walletLink}
                  walletAddress={walletAddress}
                  text={MSG.linkViewTransactions}
                />
              ),
            }}
          />
        </p>
      </aside>
    </div>
  );
};

Wallet.displayName = 'dashboard.Wallet';

export default Wallet;
