/* @flow */

import React, { Component } from 'react';
import { List } from 'immutable';
import { defineMessages, FormattedMessage } from 'react-intl';
import EthereumQRPlugin from 'ethereum-qr-code';

import type { DialogType } from '~core/Dialog';
import type { TokenRecord } from '~immutable';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import CopyableAddress from '~core/CopyableAddress';
import Button from '~core/Button';
import Heading from '~core/Heading';

import WalletTransactions from '../WalletTransactions';
import TokenList from '~admin/Tokens/TokenList.jsx';

import styles from './Wallet.css';

import mockUser from './__datamocks__/mockUser';
import mockTransactions from './__datamocks__/mockTransactions';

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

const displayName = 'dashboard.Wallet';

type Props = {
  openDialog: (dialogName: string, dialogProps?: Object) => DialogType,
  tokens: Array<TokenType>,
  /**  Add QR code to Ethereum address */
  qrCode: boolean,
};

class Wallet extends Component<Props> {
  componentDidMount() {
    const { qrCode } = this.props;

    if (qrCode) {
      const qr = new EthereumQRPlugin();

      qr.toCanvas(
        {
          to: mockUser.walletAddress,
        },
        {
          size: 50,
          selector: '#qr-code',
          options: { margin: 0 },
        },
      );
    }
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
    const { tokens, qrCode } = this.props;
    return (
      <div className={styles.layoutMain}>
        <main className={styles.content}>
          <div className={styles.walletDetails}>
            {qrCode && <div className={styles.qr} id="qr-code" />}
            <div className={styles.address}>
              <Heading
                text={MSG.titleWallet}
                appearance={{ size: 'medium', margin: 'small' }}
              />
              <CopyableAddress appearance={{ theme: 'big' }} full>
                {mockUser.walletAddress}
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
                transactions={mockTransactions}
                userAddress={mockUser.profile.walletAddress}
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

Wallet.displayName = displayName;

export default Wallet;
