/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './StepBackupPhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

import type { SubmitFn } from '../../../core/components/Wizard';

type FormValues = {
  passphrase: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepBackupPhrase.heading',
    defaultMessage: 'Let’s make an alternative Backup',
  },
  subTitle: {
    id: 'CreateWallet.StepBackupPhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'We do not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.',
  },
  confirmButton: {
    id: 'CreateWallet.StepBackupPhrase.confirmButton',
    defaultMessage: 'I’ve created a backup',
  },
  backButton: {
    id: 'CreateWallet.StepBackupPhrase.backButton',
    defaultMessage: 'Back',
  },
  backupButton: {
    id: 'CreateWallet.StepBackupPhrase.backupButton',
    defaultMessage: 'Backup Mnemonic',
  },
  titleBox: {
    id: 'CreateWallet.StepBackupPhrase.titleBox',
    defaultMessage: `Your Mnemonic Phrase`,
  },
});

const StepBackupPhrase = ({
  handleSubmit,
  values: { passphrase },
  previousStep,
}: Props) => (
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
      <Heading
        appearance={{ size: 'small', width: 'bold' }}
        text={MSG.titleBox}
      />
      <div className={styles.greyBox}>{passphrase}</div>
      <div className={styles.backupButton}>
        <Button appearance={{ theme: 'primary' }} text={MSG.backupButton} />
      </div>
      <div className={styles.buttonsForBox}>
        <Button
          appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
          text={MSG.backButton}
          onClick={previousStep}
        />
        <Button
          type="submit"
          appearance={{ theme: 'danger' }}
          text={MSG.confirmButton}
        />
      </div>
    </section>
  </form>
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepBackupPhrase;
