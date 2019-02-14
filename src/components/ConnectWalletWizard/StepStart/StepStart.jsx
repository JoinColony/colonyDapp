/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~components/core/Wizard';

import { isDev } from '~utils/debug';
import Heading from '~components/core/Heading';
import { Form } from '~components/core/Fields';
import DecisionHub, { DecisionOption } from '~components/core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes';

import type { WalletMethod } from '~types';

import styles from './StepStart.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'users.ConnectWalletWizard.StepStart.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  createWalletTitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletTitle',
    defaultMessage: 'Need a wallet? Let us help',
  },
  createWalletSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletSubtitle',
    defaultMessage: 'Create an etherum wallet to join',
  },
  metaMaskTitle: {
    id: 'users.ConnectWalletWizard.StepStart.metaMaskTitle',
    defaultMessage: 'MetaMask',
  },
  trezorTitle: {
    id: 'users.ConnectWalletWizard.StepStart.trezorTitle',
    defaultMessage: 'Trezor Hardware Wallet',
  },
  trezorSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.trezorSubtitle',
    defaultMessage: 'Login using the Trezor hardware wallet',
  },
  ledgerTitle: {
    id: 'users.ConnectWalletWizard.StepStart.ledgerTitle',
    defaultMessage: 'Ledger Hardware Wallet',
  },
  trufflepigTitle: {
    id: 'users.ConnectWalletWizard.StepStart.trufflepigTitle',
    defaultMessage: 'TrufflePig',
  },
  ledgerSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.ledgerSubtitle',
    defaultMessage: 'Login using the Ledger hardware wallet',
  },
  mnemonicTitle: {
    id: 'users.ConnectWalletWizard.StepStart.mnemonicTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'users.ConnectWalletWizard.StepStart.JSONTitle',
    defaultMessage: 'JSON File',
  },
  metaMaskSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.metaMaskSubtitle',
    defaultMessage: 'Require MetaMask browser extension',
  },
  mnemonicSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.mnemonicSubtitle',
    defaultMessage: 'Access with your mnemonic',
  },
  JSONSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
  trufflepigSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.trufflepigSubtitle',
    defaultMessage: 'Use wallet from TrufflePig (dev mode only)',
  },
});

type FormValues = {
  method: WalletMethod,
};

const displayName = 'users.ConnectWalletWizard.StepStart';

const options = [
  {
    value: 'metamask',
    title: MSG.metaMaskTitle,
    subtitle: MSG.metaMaskSubtitle,
    icon: 'metamask',
  },
  {
    value: 'ledger',
    title: MSG.ledgerTitle,
    subtitle: MSG.ledgerSubtitle,
    icon: 'wallet',
  },
  {
    value: 'trezor',
    title: MSG.trezorTitle,
    subtitle: MSG.trezorSubtitle,
    icon: 'wallet',
  },
  {
    value: 'mnemonic',
    title: MSG.mnemonicTitle,
    subtitle: MSG.mnemonicSubtitle,
    icon: 'wallet',
  },
  {
    value: 'json',
    title: MSG.JSONTitle,
    subtitle: MSG.JSONSubtitle,
    icon: 'file',
  },
];

if (isDev) {
  options.push({
    value: 'trufflepig',
    title: MSG.trufflepigTitle,
    subtitle: MSG.trufflepigSubtitle,
    icon: 'wallet',
  });
}

const createWalletOption = {
  value: null,
  title: MSG.createWalletTitle,
  subtitle: MSG.createWalletSubtitle,
  icon: 'hugging',
};

type Props = WizardProps<FormValues>;

const StepStart = ({ nextStep, wizardValues }: Props) => (
  <Form onSubmit={nextStep} initalValues={wizardValues}>
    <main className={styles.content}>
      <div className={styles.title}>
        <Heading
          appearance={{ size: 'medium', weight: 'thin' }}
          text={MSG.heading}
        />
      </div>
      <div className={styles.subtitle}>
        <Heading
          appearance={{ size: 'normal', weight: 'thin' }}
          text={MSG.subTitle}
        />
      </div>
      <DecisionHub name="method" options={options} />
      <div className={styles.createWalletLink} data-test="createWalletLink">
        <DecisionOption
          appearance={{ theme: 'alt' }}
          name="create"
          option={createWalletOption}
          link={CREATE_WALLET_ROUTE}
        />
      </div>
    </main>
  </Form>
);

StepStart.displayName = displayName;

export default StepStart;
