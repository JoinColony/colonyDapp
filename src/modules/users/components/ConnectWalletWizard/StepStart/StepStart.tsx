import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import { WizardProps } from '~core/Wizard';
import { WALLET_SPECIFICS } from '~immutable/index';
import { isDev } from '~utils/debug';
import Heading from '~core/Heading';
import { Form } from '~core/Fields';
import ExternalLink from '~core/ExternalLink';
import DecisionHub, { DecisionOption } from '~core/DecisionHub';
import { CREATE_WALLET_ROUTE } from '~routes/index';
import styles from './StepStart.css';

const MSG = defineMessages({
  heading: {
    id: 'users.ConnectWalletWizard.StepStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'users.ConnectWalletWizard.StepStart.subTitle',
    defaultMessage: `Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.`,
  },
  createWalletTitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletTitle',
    defaultMessage: 'Need a wallet? Let us help.',
  },
  createWalletSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.createWalletSubtitle',
    defaultMessage: 'Create an Etherum wallet to join',
  },
  trezorTitle: {
    id: 'users.ConnectWalletWizard.StepStart.trezorTitle',
    defaultMessage: 'Trezor Hardware Wallet',
  },
  trezorSubtitle: {
    id: 'users.ConnectWalletWizard.StepStart.trezorSubtitle',
    defaultMessage: 'Coming soon',
    // To be re-enabled for colonyDapp#1760
    // defaultMessage: 'Log in using the Trezor hardware wallet',
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
    defaultMessage: 'Coming soon',
    // To be re-enabled for colonyDapp#1760
    // defaultMessage: 'Log in using the Ledger hardware wallet',
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
    defaultMessage: 'Requires MetaMask browser extension',
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
  agreeToUseDapp: {
    id: 'users.ConnectWalletWizard.StepStart.agreeToUseDapp',
    defaultMessage: 'By using our App, you agree to our {tos}.',
  },
  termsOfService: {
    id: 'users.ConnectWalletWizard.StepStart.termsOfService',
    defaultMessage: 'Terms and Conditions of Use',
  },
});

type FormValues = {
  method: WALLET_SPECIFICS;
};

const displayName = 'users.ConnectWalletWizard.StepStart';

const options = [
  {
    value: WALLET_SPECIFICS.METAMASK,
    title: { id: 'wallet.metamask' },
    subtitle: MSG.metaMaskSubtitle,
    icon: 'metamask',
  },
  {
    value: WALLET_SPECIFICS.MNEMONIC,
    title: MSG.mnemonicTitle,
    subtitle: MSG.mnemonicSubtitle,
    icon: 'wallet',
  },
  {
    value: WALLET_SPECIFICS.JSON,
    title: MSG.JSONTitle,
    subtitle: MSG.JSONSubtitle,
    icon: 'file',
  },
  {
    value: WALLET_SPECIFICS.LEDGER,
    title: MSG.ledgerTitle,
    subtitle: MSG.ledgerSubtitle,
    icon: 'wallet',
    // To be re-enabled for colonyDapp#1760
    disabled: true,
  },
  {
    value: WALLET_SPECIFICS.TREZOR,
    title: MSG.trezorTitle,
    subtitle: MSG.trezorSubtitle,
    icon: 'wallet',
    // To be re-enabled for colonyDapp#1760
    disabled: true,
  },
];

if (isDev) {
  options.push({
    value: WALLET_SPECIFICS.TRUFFLEPIG,
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
  <Form onSubmit={nextStep} initialValues={wizardValues}>
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
      <div className={styles.subtitle}>
        <Heading appearance={{ size: 'normal', weight: 'thin' }}>
          <FormattedMessage
            {...MSG.agreeToUseDapp}
            values={{
              tos: (
                <ExternalLink
                  text={MSG.termsOfService}
                  href="https://colony.io/terms.pdf"
                />
              ),
            }}
          />
        </Heading>
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
