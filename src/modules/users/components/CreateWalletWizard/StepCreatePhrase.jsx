/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import softwareWallet from '@colony/purser-software';

import { CONNECT_ROUTE } from '~routes';

import styles from './StepCreatePhrase.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import MnemonicGenerator from '../../../core/components/MnemonicGenerator';

const MSG = defineMessages({
  heading: {
    id: 'CreateWalletWizard.StepCreatePhrase.heading',
    defaultMessage: 'Great, let’s get started by creating your new wallet!',
  },
  subTitle: {
    id: 'CreateWalletWizard.StepCreatePhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'The key to your wallet is your mnemonic phrase. Write it down and put it in a safe place; you’ll use it to access Colony. Once you’ve safely stored your mnemonic, we’ll go to the next step.',
  },
  confirmButton: {
    id: 'CreateWalletWizard.StepCreatePhrase.confirmButton',
    defaultMessage: 'I’ve safely stored it',
  },
  backLink: {
    id: 'CreateWalletWizard.StepCreatePhrase.backLink',
    defaultMessage: 'Back',
  },
});

type FormValues = {
  passphrase: string,
};

const createMnemonic = async () => {
  const newWalletInstance = await softwareWallet.create();
  return newWalletInstance.mnemonic;
};

const StepCreatePhrase = () => (
  <main className={styles.content}>
    <div className={styles.title}>
      <Heading
        appearance={{ size: 'medium', width: 'thin' }}
        text={MSG.heading}
      />
    </div>
    <div className={styles.subtitle}>
      <Heading
        appearance={{ size: 'normal', width: 'thin' }}
        text={MSG.subTitle}
      />
    </div>
    <div className={styles.greyBox}>
      <MnemonicGenerator name="mnemonic" generateFn={createMnemonic} />
    </div>
    <div className={styles.buttonsForBox}>
      <Button
        appearance={{ theme: 'ghost' }}
        linkTo={CONNECT_ROUTE}
        text={MSG.backLink}
      />
      <Button
        appearance={{ theme: 'primary' }}
        type="submit"
        text={MSG.confirmButton}
      />
    </div>
  </main>
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepCreatePhrase;
