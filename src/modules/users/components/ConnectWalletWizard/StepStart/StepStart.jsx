/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { WizardProps } from '~core/Wizard';

import { isDev } from '~utils/debug';
import Heading from '~core/Heading';
import { Form } from '~core/Fields';
import DecisionHub, { DecisionOption } from '~core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes';

import type { WalletMethod } from '../../../types';

import styles from './StepStart.css';

const MSG = defineMessages({
  heading: {
    id: 'ConnectWalletWizard.StepStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'ConnectWalletWizard.StepStart.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  createWalletTitle: {
    id: 'ConnectWalletWizard.StepStart.createWalletTitle',
    defaultMessage: 'Need a wallet? Let us help',
  },
  createWalletSubtitle: {
    id: 'ConnectWalletWizard.StepStart.createWalletSubtitle',
    defaultMessage: 'Create an etherum wallet to join',
  },
  metaMaskTitle: {
    id: 'ConnectWalletWizard.StepStart.metaMaskTitle',
    defaultMessage: 'MetaMask',
  },
  trezorTitle: {
    id: 'ConnectWalletWizard.StepStart.trezorTitle',
    defaultMessage: 'Trezor Hardware Wallet',
  },
  trezorSubtitle: {
    id: 'ConnectWalletWizard.StepStart.trezorSubtitle',
    defaultMessage: 'Login using the Trezor hardware wallet',
  },
  ledgerTitle: {
    id: 'ConnectWalletWizard.StepStart.ledgerTitle',
    defaultMessage: 'Ledger Hardware Wallet',
  },
  trufflepigTitle: {
    id: 'ConnectWalletWizard.StepStart.trufflepigTitle',
    defaultMessage: 'TrufflePig',
  },
  ledgerSubtitle: {
    id: 'ConnectWalletWizard.StepStart.ledgerSubtitle',
    defaultMessage: 'Login using the Ledger hardware wallet',
  },
  mnemonicTitle: {
    id: 'ConnectWalletWizard.StepStart.mnemonicTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'ConnectWalletWizard.StepStart.JSONTitle',
    defaultMessage: 'JSON File',
  },
  metaMaskSubtitle: {
    id: 'ConnectWalletWizard.StepStart.metaMaskSubtitle',
    defaultMessage: 'Require MetaMask browser extension',
  },
  mnemonicSubtitle: {
    id: 'ConnectWalletWizard.StepStart.mnemonicSubtitle',
    defaultMessage: 'Access with your mnemonic',
  },
  JSONSubtitle: {
    id: 'ConnectWalletWizard.StepStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
  trufflepigSubtitle: {
    id: 'ConnectWalletWizard.StepStart.trufflepigSubtitle',
    defaultMessage: 'Use wallet from TrufflePig (dev mode only)',
  },
});

type FormValues = {
  method: WalletMethod,
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
      <div className={styles.createWalletLink}>
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

// export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
//   nextStep();

// export const Step = StepStart;

export default StepStart;
