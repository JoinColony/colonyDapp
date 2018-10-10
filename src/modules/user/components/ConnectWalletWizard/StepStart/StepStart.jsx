/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';

import Heading from '~core/Heading';
import DecisionHub, { DecisionOption } from '~core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes';

import styles from './StepStart.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWalletWizard.WalletStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'ConnectWalletWizard.WalletStart.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  createWalletTitle: {
    id: 'ConnectWalletWizard.WalletStart.createWalletTitle',
    defaultMessage: 'Need a wallet? Let us help',
  },
  createWalletSubtitle: {
    id: 'ConnectWalletWizard.WalletStart.createWalletSubtitle',
    defaultMessage: 'Create an etherum wallet to join',
  },
  metaMaskTitle: {
    id: 'ConnectWalletWizard.WalletStart.metaMaskTitle',
    defaultMessage: 'MetaMask',
  },
  hardwareTitle: {
    id: 'ConnectWalletWizard.WalletStart.hardwareTitle',
    defaultMessage: 'Hardware Wallet',
  },
  phraseTitle: {
    id: 'ConnectWalletWizard.WalletStart.phraseTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'ConnectWalletWizard.WalletStart.JSONTitle',
    defaultMessage: 'JSON File',
  },
  metaMaskSubtitle: {
    id: 'ConnectWalletWizard.WalletStart.metaMaskSubtitle',
    defaultMessage: 'Require MetaMask browser extension',
  },
  hardwareSubtitle: {
    id: 'ConnectWalletWizard.WalletStart.hardwareSubtitle',
    defaultMessage: 'We support Ledger and Trezor',
  },
  phraseSubtitle: {
    id: 'ConnectWalletWizard.WalletStart.phraseSubtitle',
    defaultMessage: 'Access with your mnemonic phrase',
  },
  JSONSubtitle: {
    id: 'ConnectWalletWizard.WalletStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
});

type FormValues = {
  method: 'metamask' | 'hardware' | 'phrase' | 'json',
};

const displayName = 'user.ConnectWalletWizard.StepStart';

const options = [
  {
    value: 'metamask',
    title: MSG.metaMaskTitle,
    subtitle: MSG.metaMaskSubtitle,
    icon: 'metamask',
  },
  {
    value: 'hardware',
    title: MSG.hardwareTitle,
    subtitle: MSG.hardwareSubtitle,
    icon: 'wallet',
  },
  {
    value: 'phrase',
    title: MSG.phraseTitle,
    subtitle: MSG.phraseSubtitle,
    icon: 'wallet',
  },
  {
    value: 'json',
    title: MSG.JSONTitle,
    subtitle: MSG.JSONSubtitle,
    icon: 'file',
  },
];

const createWalletOption = {
  value: null,
  title: MSG.createWalletTitle,
  subtitle: MSG.createWalletSubtitle,
  icon: 'hugging',
};

const StepStart = () => (
  <section className={styles.content}>
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
    <div className={styles.createWalletLink}>
      <DecisionOption
        appearance={{ theme: 'alt' }}
        name="create"
        option={createWalletOption}
        link={CREATE_WALLET_ROUTE}
      />
    </div>
  </section>
);

StepStart.displayName = displayName;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepStart;
