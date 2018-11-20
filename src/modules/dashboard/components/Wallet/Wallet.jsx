/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { Tab, Tabs, TabList, TabPanel } from '~core/Tabs';
import CopyableAddress from '~core/CopyableAddress';
import Button from '~core/Button';
import Heading from '~core/Heading';

import WalletTransactions from '../WalletTransactions';

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
        <TabPanel>Token</TabPanel>
        <TabPanel>
          <WalletTransactions
            transactions={mockTransactions}
            userAddress={mockUser.walletAddress}
          />
        </TabPanel>
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
