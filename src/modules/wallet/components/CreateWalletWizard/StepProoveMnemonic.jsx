/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import { compose, withProps } from 'recompose';

import styles from './StepProoveMnemonic.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import Input from '../../../core/components/Fields/Input';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepProoveMnemonic.heading',
    defaultMessage: 'Did you really back up your mnemoic phrase? Prove it!',
  },
  subTitle: {
    id: 'CreateWallet.StepProoveMnemonic.subTitle',
    defaultMessage: `
      We will not be able to recover your mnemonic phrase for any reason
      so we wanted to make sure you've got it safe. Yes, we know that we are
      being precautions but, you know, better safe than sorry!
    `,
  },
  instructions: {
    id: 'CreateWallet.StepProoveMnemonic.instructions',
    defaultMessage: 'Type the appropriate word from your mnemonic phrase',
  },
  nextButton: {
    id: 'CreateWallet.StepProoveMnemonic.confirmButton',
    defaultMessage: 'Next',
  },
  backButton: {
    id: 'CreateWallet.StepProoveMnemonic.backButton',
    defaultMessage: 'Back',
  },
  proofWord: {
    id: 'CreateWallet.StepProoveMnemonic.firstProofWord',
    defaultMessage: 'Word {count}',
  },
});

type FormValues = {
  firstProofWord: string,
  secondProofWord: string,
  thirdProofWord: string,
};

type Props = {
  previousStep: () => void,
  chosenProofWords: Array<number>,
} & FormikProps<FormValues>;

const StepProoveMnemonic = ({
  chosenProofWords,
  previousStep,
  handleSubmit,
  isValid,
}: Props) => (
  <form className={styles.main} onSubmit={handleSubmit}>
    <section className={styles.titleSection}>
      <Heading
        appearance={{ size: 'medium', weight: 'thin' }}
        text={MSG.heading}
      />
      <Heading
        appearance={{ size: 'normal', weight: 'thin' }}
        text={MSG.subTitle}
      />
      <div className={styles.instructions}>
        <Heading
          appearance={{ size: 'normal', weight: 'bold' }}
          text={MSG.instructions}
        />
      </div>
    </section>
    <div className={styles.inputFields}>
      <Input
        appearance={{ theme: 'fat' }}
        name="firstProofWord"
        label={MSG.proofWord}
        labelValues={{ count: chosenProofWords[0] + 1 }}
      />
      <Input
        appearance={{ theme: 'fat' }}
        name="secondProofWord"
        label={MSG.proofWord}
        labelValues={{ count: chosenProofWords[1] + 1 }}
      />
      <Input
        appearance={{ theme: 'fat' }}
        name="thirdProofWord"
        label={MSG.proofWord}
        labelValues={{ count: chosenProofWords[2] + 1 }}
      />
    </div>
    <div className={styles.actionsContainer}>
      <Button
        text={MSG.backButton}
        appearance={{ theme: 'secondary', size: 'large' }}
        onClick={previousStep}
      />
      <Button
        appearance={{ theme: 'primary', size: 'large' }}
        text={MSG.nextButton}
        type="submit"
        disabled={!isValid}
        style={{ width: styles.wideButton }}
      />
    </div>
  </form>
);

/*
 * @TODO The word choosen to test should be randomized
 *
 * This can be done by splitting the mnemonic, randomizing it, then extract the
 * chosen word, before chosing another
 */
const chosenProofWords = [1, 4, 11];

const enhance = compose(
  withProps(({ values: { passphrase } }) => ({
    mnemonicWords: passphrase.split(' '),
    chosenProofWords,
  })),
);

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = enhance(StepProoveMnemonic);
