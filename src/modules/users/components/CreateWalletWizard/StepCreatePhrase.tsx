import React from 'react';
import { defineMessages } from 'react-intl';
import softwareWallet from '@colony/purser-software';

import { WizardProps } from '~core/Wizard';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { Form } from '~core/Fields';
import MnemonicGenerator from '~core/MnemonicGenerator';

import { CONNECT_ROUTE } from '~routes/index';

import styles from './StepCreatePhrase.css';

const MSG = defineMessages({
  heading: {
    id: 'CreateWalletWizard.StepCreatePhrase.heading',
    defaultMessage: 'Great, let’s get started by creating your new wallet!',
  },
  subTitle: {
    id: 'CreateWalletWizard.StepCreatePhrase.subTitle',
    defaultMessage: `The key to your wallet is your mnemonic phrase. Write it down and put it in a safe place; you’ll use it to access Colony. Once you’ve safely stored your mnemonic, we’ll go to the next step.`,
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
  passphrase: string;
};

type Props = WizardProps<FormValues>;

const createMnemonic = async () => {
  const newWalletInstance = await softwareWallet.create();
  return newWalletInstance.mnemonic;
};

const StepCreatePhrase = ({ nextStep, wizardForm }: Props) => (
  <main className={styles.content}>
    <Form onSubmit={nextStep} {...wizardForm}>
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
          data-test="confirmStoredPhraseButton"
        />
      </div>
    </Form>
  </main>
);

export default StepCreatePhrase;
