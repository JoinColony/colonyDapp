/* @flow */

import type { FormikProps } from 'formik';
import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import styles from './StepProveMnemonic.css';

import type { ActionSubmit } from '~core/Wizard';

import { Input, InputLabel } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';

import { CREATE_WALLET, WALLET_SET } from '../../actionTypes';

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

/*
 * @TODO The word choosen to test should be randomized
 *
 * This can be done by splitting the mnemonic, randomizing it, then extract the
 * chosen word, before chosing another
 */
const chosenProofWords = [1, 4, 11];

type FormValues = {
  mnemonic: string,
  proofWord1: string,
  proofWord2: string,
  proofWord3: string,
};

type Props = {
  previousStep: () => void,
  createWalletAction: (string, *) => void,
} & FormikProps<FormValues>;

type FormValidation = {
  mnemonic: string,
} & FormValues;

const StepProveMnemonic = ({ previousStep, isValid, isSubmitting }: Props) => (
  <main className={styles.main}>
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
        {!isValid && (
          <Heading text={MSG.errorWrongProofWords} className={styles.error} />
        )}
      </div>
    </section>
    <div className={styles.inputFields}>
      {chosenProofWords.map((wordIndex, arrayIndex) => (
        <Fragment key={`proofWordKey_${wordIndex}`}>
          <InputLabel
            label={MSG.proofWord}
            labelValues={{ count: `${wordIndex + 1}` }}
          />
          <Input
            name={`proofWord${arrayIndex + 1}`}
            className={!isValid ? styles.customInputError : styles.customInput}
            elementOnly
          />
        </Fragment>
      ))}
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
        loading={isSubmitting}
        style={{ width: styles.wideButton }}
      />
    </div>
  </main>
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
  isInitialValid: true,
  validate: ({
    mnemonic,
    proofWord1,
    proofWord2,
    proofWord3,
  }: FormValidation) => {
    const errorObject: Object = { errror: true };
    const mnemonicWords: Array<string> = mnemonic.split(' ');
    if (proofWord1 !== mnemonicWords[chosenProofWords[0]]) {
      return errorObject;
    }
    if (proofWord2 !== mnemonicWords[chosenProofWords[1]]) {
      return errorObject;
    }
    if (proofWord3 !== mnemonicWords[chosenProofWords[2]]) {
      return errorObject;
    }
    return {};
  },
};

export const onSubmit: ActionSubmit<FormValues> = {
  submit: CREATE_WALLET,
  success: WALLET_SET,
  // TODO: We don't have that, I don't know how to catch errors in sagas. Maybe it's not necessary
  // I'll leave the required type in as a friendly reminder that we ALWAYS want error handling
  error: 'XXXXXX',
};

export const Step = StepProveMnemonic;
