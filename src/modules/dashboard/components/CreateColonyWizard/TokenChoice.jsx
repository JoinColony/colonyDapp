/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './TokenChoice.css';

import WizardTemplate from '../../../pages/WizardTemplate';
import Heading from '../../../core/components/Heading';
import Link from '../../../core/components/Link';
import Icon from '../../../core/components/Icon';
import DecisionHub from '../../../core/components/DecisionHub';

type FormValues = {
  nextStep: () => void,
};

const icons = ['metamask', 'wallet', 'phrase', 'file'];

const MSG = defineMessages({
  heading: {
    id: 'WalletStart.heading',
    defaultMessage: 'How would you like to access Colony?',
  },
  subTitle: {
    id: 'WalletStart.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  callToAction: {
    id: 'WalletStart.callToAction',
    defaultMessage: 'Need a wallet? Let us help',
  },
  callToActionSub: {
    id: 'WalletStart.callToActionSub',
    defaultMessage: 'Create an etherum wallet to join',
  },
});

const rowTitles = defineMessages({
  metaMaskTitle: {
    id: 'WalletStart.metaMaskTitle',
    defaultMessage: 'MetaMask',
  },
  hardwareTitle: {
    id: 'WalletStart.hardwareTitle',
    defaultMessage: 'Hardware Wallet',
  },
  phraseTitle: {
    id: 'WalletStart.phraseTitle',
    defaultMessage: 'Mnemonic Phrase',
  },
  JSONTitle: {
    id: 'WalletStart.JSONTitle',
    defaultMessage: 'JSON File',
  },
});

const rowSubTitles = defineMessages({
  metaMaskSubtTitle: {
    id: 'WalletStart.metaMaskSubtitle',
    defaultMessage: 'Require MetaMask browser extension',
  },
  hardwareSubtTitle: {
    id: 'WalletStart.hardwareSubtitle',
    defaultMessage: 'We support Ledger and Trezor',
  },
  phraseSubtTitle: {
    id: 'WalletStart.phraseSubtitle',
    defaultMessage: 'Access with your mnemonic phrase',
  },
  JSONSubtTitle: {
    id: 'WalletStart.JSONSubtitle',
    defaultMessage: 'We do not recommend this method',
  },
});

const TokenChoice = () => (
  <WizardTemplate internal>
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
      {
        <DecisionHub
          icons={icons}
          rowTitles={rowTitles}
          rowSubTitles={rowSubTitles}
        />
      }
      <Link to="/createwallet">
        <div className={styles.callToAction}>
          <div className={styles.actionImage}>
            <Icon name="hugging" title="hugging-face" />
          </div>
          <div className={styles.actionText}>
            <Heading
              appearance={{ size: 'small', weight: 'bold', margin: 'small' }}
              text={MSG.callToAction}
            />
            <Heading
              appearance={{ size: 'tiny', weight: 'thin', margin: 'small' }}
              text={MSG.callToActionSub}
            />
          </div>
          <Icon name="caret-right" title="caret-right" />
        </div>
      </Link>
    </section>
  </WizardTemplate>
);

export const Step = TokenChoice;

export const onSubmit: SubmitFn<FormValues> = ({ nextStep }) => nextStep();
