/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { DialogType } from '~components/core/Dialog';
import type { ContractTransactionType, DataType, TokenType } from '~immutable';
import type { Address } from '~types';

import { Tab, Tabs, TabList, TabPanel } from '~components/core/Tabs';
import CopyableAddress from '~components/core/CopyableAddress';
import Button from '~components/core/Button';
import Heading from '~components/core/Heading';
import QRCode from '~components/core/QRCode';

import WalletTransactions from '../WalletTransactions';
import TokenList from '~components/Tokens/TokenList.jsx';

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
  linkEditToken: {
    id: 'dashboard.Wallet.linkEditToken',
    defaultMessage: 'Edit Tokens Here',
  },
});

type Props = {|
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  tokens: Array<TokenType>,
  walletAddress: Address,
  transactions: ?DataType<Array<ContractTransactionType>>,
  fetchUserTransactions: () => any,
|};

class Wallet extends Component<Props> {
  displayName = 'dashboard.Wallet';

  componentDidMount() {
    const { transactions, fetchUserTransactions } = this.props;
    if (!(transactions && transactions.record && transactions.record.length))
      fetchUserTransactions();
  }

  handleEditToken = () => {
    const { openDialog, tokens } = this.props;
    const tokenDialog = openDialog('TokenEditDialog', {
      tokens,
      tokenOwner: 'User',
    });

    tokenDialog
      .afterClosed()
      .then(() => {
        /* eslint-disable-next-line no-console */
        console.log(tokenDialog.props);
      })
      .catch(() => {
        // cancel actions here
      });
  };

  render() {
    const { tokens, walletAddress, transactions } = this.props;
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
          <Tabs>
            <TabList>
              <Tab>
                <FormattedMessage {...MSG.tabTokens} />
              </Tab>
              <Tab>
                <FormattedMessage {...MSG.tabTransactions} />
              </Tab>
            </TabList>
            <TabPanel>
              <TokenList tokens={tokens} appearance={{ numCols: '3' }} />
            </TabPanel>
            <TabPanel>
              <WalletTransactions
                transactions={transactions}
                userAddress={walletAddress}
              />
            </TabPanel>
          </Tabs>
        </main>
        <aside className={styles.sidebar}>
          <p className={styles.helpText}>
            <FormattedMessage {...MSG.helpText} />
            <Button
              appearance={{ theme: 'blue', size: 'small' }}
              text={MSG.linkEditToken}
              onClick={this.handleEditToken}
            />
          </p>
        </aside>
      </div>
    );
  }
}

export default Wallet;
