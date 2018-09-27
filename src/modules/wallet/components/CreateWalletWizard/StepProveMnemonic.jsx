/* @flow */

import type { FormikProps } from 'formik';
import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';

import styles from './StepProveMnemonic.css';

import { withBoundActionCreators } from '~utils/redux';

import type { SubmitFn } from '../../../core/components/Wizard';

import { Input, InputLabel } from '../../../core/components/Fields';
import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

import {
  /*
   * Prettier sugests a fix that would break the line length rule.
   * This comment fixes that :)
   */
  createWallet as createWalletAction,
} from '../../actionCreators/wallet';

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
  passphrase: string,
  proofWord1: string,
  proofWord2: string,
  proofWord3: string,
};

type Props = {
  previousStep: () => void,
  createWalletAction: (string, *) => void,
} & FormikProps<FormValues>;

type FormValidation = {
  passphrase: string,
} & FormValues;

const StepProveMnemonic = ({
  previousStep,
  handleSubmit,
  isValid,
  values: { passphrase },
  createWalletAction: createWallet,
}: Props) => (
  <form
    className={styles.main}
    /*
     * We hook into the `onSubmit` prop of the form, because the `onSubmit` function
     * exported by this Step won't receive (from `withWizard`) the bound action creator
     * as a prop
     */
    onSubmit={() => createWallet(passphrase, handleSubmit)}
  >
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
        style={{ width: styles.wideButton }}
      />
    </div>
  </form>
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
    passphrase,
    proofWord1,
    proofWord2,
    proofWord3,
  }: FormValidation) => {
    const errorObject: Object = { errror: true };
    const mnemonicWords: Array<string> = passphrase.split(' ');
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

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = withBoundActionCreators({ createWalletAction })(
  StepProveMnemonic,
);
