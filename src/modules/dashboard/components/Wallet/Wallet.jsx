/* @flow */

// $FlowFixMe until hooks types
import React, { useCallback } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { DialogType } from '~core/Dialog';
import type { TokenReferenceType } from '~immutable';
import type { Address } from '~types';

import CopyableAddress from '~core/CopyableAddress';
import Button from '~core/Button';
import Heading from '~core/Heading';
import QRCode from '~core/QRCode';
import WalletLink from '~core/WalletLink';
import { SpinnerLoader } from '~core/Preloaders';
import TokenList from '~admin/Tokens/TokenList.jsx';

import { useDataFetcher } from '~utils/hooks';
import { currentUserTokensFetcher } from '../../../users/fetchers';

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
    defaultMessage: 'Edit Tokens Here',
  },
  linkViewTransactions: {
    id: 'dashboard.Wallet.linkViewTransactions',
    defaultMessage: 'Here',
  },
});

type Props = {|
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  walletAddress: Address,
|};

const Wallet = ({ walletAddress, openDialog }: Props) => {
  const { isFetching: isFetchingTokens, data: tokens } = useDataFetcher<
    TokenReferenceType[],
  >(currentUserTokensFetcher, [], []);
  const editTokens = useCallback(
    () =>
      openDialog('UserTokenEditDialog', {
        selectedTokens: tokens && tokens.map(({ address }) => address),
      }),
    [openDialog, tokens],
  );
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
        {isFetchingTokens ? (
          <SpinnerLoader />
        ) : (
          <TokenList tokens={tokens || []} appearance={{ numCols: '3' }} />
        )}
      </main>
      <aside className={styles.sidebar}>
        <p className={styles.helpText}>
          <FormattedMessage {...MSG.helpText} />
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
