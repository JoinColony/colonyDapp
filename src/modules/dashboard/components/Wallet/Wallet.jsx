/* @flow */

import React, { Component } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import type { DialogType } from '~core/Dialog';
import type { TokenType } from '~types/token';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import CopyableAddress from '~core/CopyableAddress';
import Button from '~core/Button';
import Heading from '~core/Heading';

<<<<<<< HEAD
import WalletTransactions from '../WalletTransactions';
=======
import TokenList from '~admin/Tokens/TokenList.jsx';
>>>>>>> Extract TokenList to use it in Wallet screen

import styles from './Wallet.css';

import mockUser from './__datamocks__/mockUser';
<<<<<<< HEAD
<<<<<<< HEAD
import mockTransactions from './__datamocks__/mockTransactions';
=======
import mockTokens from './__datamocks__/mockTokens';
>>>>>>> Extract TokenList to use it in Wallet screen
=======
>>>>>>> Show modal to edit tokens

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
};

class Wallet extends Component<Props> {
  handleEditToken = () => {
    const { openDialog, tokens } = this.props;
    const tokenDialog = openDialog('TokenEditDialog', {
      tokens,
      tokenOwner: 'User',
    });

    tokenDialog.afterClosed().catch(() => {
      /* eslint-disable-next-line no-console */
      console.log(tokenDialog.props);
      // cancel actions here
    });
  };

  render() {
    const { tokens } = this.props;
    return (
      <div className={styles.layoutMain}>
        <main className={styles.content}>
          <div className={styles.walletDetails}>
            <Heading
              text={MSG.titleWallet}
              appearance={{ size: 'medium', margin: 'small' }}
            />
            <CopyableAddress appearance={{ theme: 'big' }} full>
              {mockUser.walletAddress}
            </CopyableAddress>
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
              <TokenList tokens={tokens} />
            </TabPanel>
            <TabPanel />
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
<<<<<<< HEAD
      <Tabs>
        <TabList>
          <Tab>
            <FormattedMessage {...MSG.tabTokens} />
          </Tab>
          <Tab>
            <FormattedMessage {...MSG.tabTransactions} />
          </Tab>
        </TabList>
<<<<<<< HEAD
        <TabPanel>Token</TabPanel>
        <TabPanel>
          <WalletTransactions
            transactions={mockTransactions}
            userAddress={mockUser.walletAddress}
          />
        </TabPanel>
=======
        <TabPanel>
          <TokenList tokens={mockTokens} appearance={{ numCols: '3' }} />
        </TabPanel>
        <TabPanel />
>>>>>>> Extract TokenList to use it in Wallet screen
      </Tabs>
    </main>
    <aside className={styles.sidebar}>
      <p className={styles.helpText}>
        <FormattedMessage {...MSG.helpText} />
        <Button
          appearance={{ theme: 'blue', margin: 'none', size: 'small' }}
          text={MSG.linkEditToken}
          className={styles.tokenLink}
        />
      </p>
    </aside>
  </div>
);
=======
    );
  }
}
>>>>>>> Show modal to edit tokens

Wallet.displayName = displayName;

export default Wallet;
