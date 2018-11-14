/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

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
import mockTransactions from './__datamocks__/mockTransactions';
=======
import mockTokens from './__datamocks__/mockTokens';
>>>>>>> Extract TokenList to use it in Wallet screen

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

const Wallet = () => (
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

Wallet.displayName = displayName;

export default Wallet;
