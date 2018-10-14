/* @flow */

import type { FormikProps } from 'formik';
import React from 'react';
import { defineMessages } from 'react-intl';

import type { SubmitFn } from '~core/Wizard';

import Heading from '~core/Heading';
import DecisionHub, { DecisionOption } from '~core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes';

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
  hardwareTitle: {
    id: 'ConnectWalletWizard.StepStart.hardwareTitle',
    defaultMessage: 'Hardware Wallet',
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
  hardwareSubtitle: {
    id: 'ConnectWalletWizard.StepStart.hardwareSubtitle',
    defaultMessage: 'We support Ledger and Trezor',
  },
  mnemonicSubtitle: {
    id: 'ConnectWalletWizard.StepStart.mnemonicSubtitle',
    defaultMessage: 'Access with your mnemonic mnemonic',
  },
  JSONSubtitle: {
    id: 'ConnectWalletWizard.StepStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
});

type FormValues = {
  method: 'metamask' | 'hardware' | 'mnemonic' | 'json',
};

const displayName = 'user.ConnectWalletWizard.StepStart';

type Props = {
  previousStep: () => void,
  nextStep: () => void,
} & FormikProps<FormValues>;

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

const createWalletOption = {
  value: null,
  title: MSG.createWalletTitle,
  subtitle: MSG.createWalletSubtitle,
  icon: 'hugging',
};

const StepStart = ({ handleSubmit }: Props) => (
  <form className={styles.content} onSubmit={handleSubmit}>
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
  </form>
);

StepStart.displayName = displayName;

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepStart;
