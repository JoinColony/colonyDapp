/* @flow */

import type { FormikProps } from 'formik';

import React from 'react';
import { defineMessages } from 'react-intl';
import { compose, withProps } from 'recompose';

import styles from './StepProveMnemonic.css';

import type { SubmitFn } from '../../../core/components/Wizard';

import { Input, InputLabel } from '../../../core/components/Fields';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepProveMnemonic.heading',
    defaultMessage: 'Did you really back up your mnemoic phrase? Prove it!',
  },
  subTitle: {
    id: 'CreateWallet.StepProveMnemonic.subTitle',
    defaultMessage: `
      We will not be able to recover your mnemonic phrase for any reason
      so we wanted to make sure you've got it safe. Yes, we know that we are
      being precautions but, you know, better safe than sorry!
    `,
  },
  instructions: {
    id: 'CreateWallet.StepProveMnemonic.instructions',
    defaultMessage: 'Type the appropriate word from your mnemonic phrase',
  },
  nextButton: {
    id: 'CreateWallet.StepProveMnemonic.confirmButton',
    defaultMessage: 'Next',
  },
  backButton: {
    id: 'CreateWallet.StepProveMnemonic.backButton',
    defaultMessage: 'Back',
  },
  proofWord: {
    id: 'CreateWallet.StepProveMnemonic.firstProofWord',
    defaultMessage: 'Word {count}',
  },
  errorWrongProofWords: {
    id: 'CreateWallet.StepProveMnemonic.Error.wrongProofWords',
    defaultMessage:
      'Double check your words, seems like at least one of them is wrong.',
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
  generalError: boolean,
} & FormikProps<FormValues>;

type FormValidation = {
  passphrase: string,
} & FormValues;

const StepProveMnemonic = ({
  chosenProofWords,
  previousStep,
  handleSubmit,
  generalError,
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
          appearance={{ size: 'normal', weight: 'bold', margin: 'none' }}
          text={MSG.instructions}
        />
        {generalError && (
          <Heading text={MSG.errorWrongProofWords} className={styles.error} />
        )}
      </div>
    </section>
    <div className={styles.inputFields}>
      <InputLabel
        label={MSG.proofWord}
        labelValues={{ count: `${chosenProofWords[0] + 1}` }}
      />
      <Input
        name="firstProofWord"
        className={generalError ? styles.customInputError : styles.customInput}
        elementOnly
      />
      <InputLabel
        label={MSG.proofWord}
        labelValues={{ count: `${chosenProofWords[1] + 1}` }}
      />
      <Input
        name="secondProofWord"
        className={generalError ? styles.customInputError : styles.customInput}
        elementOnly
      />
      <InputLabel
        label={MSG.proofWord}
        labelValues={{ count: `${chosenProofWords[2] + 1}` }}
      />
      <Input
        name="thirdProofWord"
        className={generalError ? styles.customInputError : styles.customInput}
        elementOnly
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
  withProps(({ errors }) => ({
    chosenProofWords,
    generalError: Object.keys(errors).length !== 0,
  })),
);

/*
 * Custom Formik validator trigger only onSubmit
 *
 * This is needed since we need access to the props passed down from the
 * previous step, so that we can specifically test against each word
 */
export const formikConfig = {
  validateOnBlur: false,
  validateOnChange: false,
  validate: ({
    passphrase,
    firstProofWord,
    secondProofWord,
    thirdProofWord,
  }: FormValidation) => {
    const errorObject = { errror: true };
    const mnemonicWords: Array<string> = passphrase.split(' ');
    if (firstProofWord !== mnemonicWords[chosenProofWords[0]]) {
      return errorObject;
    }
    if (secondProofWord !== mnemonicWords[chosenProofWords[1]]) {
      return errorObject;
    }
    if (thirdProofWord !== mnemonicWords[chosenProofWords[2]]) {
      return errorObject;
    }
    return {};
  },
};

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = enhance(StepProveMnemonic);
