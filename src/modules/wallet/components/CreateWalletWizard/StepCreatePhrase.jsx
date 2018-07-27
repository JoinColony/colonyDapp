/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './StepCreatePhrase.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import Link from '../../../core/components/Link';
import MnemonicGenerator from '../../../core/components/MnemonicGenerator';

// TODO: Replace this with actual creation function
const createMnemonic = () =>
  'local disorder era bring front sunset that scheme never unveil silent wood';

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

type Props = FormikProps<FormValues>;

const StepCreatePhrase = ({ handleSubmit }: Props) => (
  <form onSubmit={handleSubmit}>
    <section className={styles.content}>
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
        <MnemonicGenerator name="passphrase" generateFn={createMnemonic} />
      </div>
      <div className={styles.buttonsForBox}>
        <Link to="/start" text={MSG.backLink} />
        <Button
          appearance={{ theme: 'primary' }}
          type="submit"
          text={MSG.confirmButton}
        />
      </div>
    </section>
  </form>
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepCreatePhrase;
