/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import styles from './StepDragAndDropMnemonic.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import MnemonicDnDSorter from '../../../core/components/MnemonicDnDSorter';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepDragAndDropMnemonic.heading',
    defaultMessage: 'Did you really back up your mnemoic phrase. Prove it!',
  },
  subTitle: {
    id: 'CreateWallet.StepDragAndDropMnemonic.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'We do not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.',
  },
  nextButton: {
    id: 'CreateWallet.StepDragAndDropMnemonic.confirmButton',
    defaultMessage: 'Next',
  },
  backButton: {
    id: 'CreateWallet.StepDragAndDropMnemonic.backButton',
    defaultMessage: 'Back',
  },
  mnemonicBoxLabel: {
    id: 'MnemonicDnDSorter.mnemonicBoxLabel',
    defaultMessage: 'Mnemonic Phrase',
  },
  mnemonicBoxLabelHelp: {
    id: 'MnemonicDnDSorter.mnemonicBoxLabelHelp',
    defaultMessage: 'Drag your Phrase in the right order',
  },
  mnemonicBoxPlaceholder: {
    id: 'MnemonicDnDSorter.mnemonicBoxPlaceholder',
    defaultMessage: 'Drag & Drop Mnemonic here',
  },
  validationSortedMnemonic: {
    id: 'MnemonicDnDSorter.validation.sortedmnemonic',
    defaultMessage: 'The two phrases do not match. Please try again',
  },
});

type FormValues = {
  passphrase: string,
  sortedmnemonic: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

const StepDragAndDropMnemonic = ({
  values: { passphrase },
  previousStep,
  handleSubmit,
  isValid,
}: Props) => (
  <form className={styles.content} onSubmit={handleSubmit}>
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
    <div className={styles.wordContainer}>
      <MnemonicDnDSorter
        label={MSG.mnemonicBoxLabel}
        help={MSG.mnemonicBoxLabelHelp}
        placeholder={MSG.mnemonicBoxPlaceholder}
        name="sortedmnemonic"
        passphrase={passphrase}
      />
    </div>
    <div className={styles.buttonsForBox}>
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
        onClick={previousStep}
        text={MSG.backButton}
      />
      <Button
        appearance={{ theme: 'primary' }}
        type="submit"
        disabled={!isValid}
        text={MSG.nextButton}
      />
    </div>
  </form>
);

export const Step = StepDragAndDropMnemonic;

export const validationSchema = yup.object({
  passphrase: yup.string(),
  sortedmnemonic: yup
    .string()
    .required()
    .equalTo(yup.ref('passphrase'), MSG.validationSortedMnemonic),
});

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();
