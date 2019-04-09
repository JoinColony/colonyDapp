/* @flow */

import React, { Fragment } from 'react';
import { defineMessages } from 'react-intl';
import * as yup from 'yup';

import styles from './StepProveMnemonic.css';

import type { WizardProps } from '~core/Wizard';

import { mergePayload } from '~utils/actions';
import { ActionForm, FormStatus, Input } from '~core/Fields';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { ACTIONS } from '~redux';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepProveMnemonic.heading',
    defaultMessage: 'Did you really back up your mnemonic phrase? Prove it!',
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
  errorWrongWord: {
    id: 'CreateWallet.StepProveMnemonic.errorWrongWord',
    defaultMessage: 'This is not the correct word',
  },
});

/*
 * TODO The word choosen to test should be randomized
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

type Props = WizardProps<FormValues>;

const StepProveMnemonic = ({
  previousStep,
  wizardForm,
  wizardValues: { mnemonic },
}: Props) => {
  const mnemonicWords = mnemonic.split(' ');
  return (
    <main className={styles.main}>
      <ActionForm
        submit={ACTIONS.WALLET_CREATE}
        success={ACTIONS.CURRENT_USER_CREATE}
        error={ACTIONS.WALLET_CREATE_ERROR}
        transform={mergePayload({ method: 'create', mnemonic })}
        validationSchema={yup.object().shape({
          proofWord1: yup
            .string()
            .required()
            .oneOf([mnemonicWords[chosenProofWords[0]]], MSG.errorWrongWord),
          proofWord2: yup
            .string()
            .required()
            .oneOf([mnemonicWords[chosenProofWords[1]]], MSG.errorWrongWord),
          proofWord3: yup
            .string()
            .required()
            .oneOf([mnemonicWords[chosenProofWords[2]]], MSG.errorWrongWord),
        })}
        validateOnBlur={false}
        validateOnChange={false}
        {...wizardForm}
      >
        {({ isSubmitting, status, values }) => (
          <Fragment>
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
                  appearance={{
                    size: 'normal',
                    weight: 'bold',
                    margin: 'none',
                  }}
                  text={MSG.instructions}
                />
              </div>
            </section>
            <div className={styles.inputFields}>
              {chosenProofWords.map((wordIndex, arrayIndex) => (
                <Fragment key={`proofWordKey_${wordIndex}`}>
                  <Input
                    label={MSG.proofWord}
                    labelValues={{ count: `${wordIndex + 1}` }}
                    name={`proofWord${arrayIndex + 1}`}
                  />
                </Fragment>
              ))}
            </div>
            <FormStatus status={status} />
            <div className={styles.actionsContainer}>
              <Button
                appearance={{ theme: 'secondary', size: 'large' }}
                disabled={isSubmitting}
                text={MSG.backButton}
                onClick={() => previousStep(values)}
              />
              <Button
                appearance={{ theme: 'primary', size: 'large' }}
                text={MSG.nextButton}
                type="submit"
                loading={isSubmitting}
                style={{ width: styles.wideButton }}
                data-test="proveBackupPhraseButton"
              />
            </div>
          </Fragment>
        )}
      </ActionForm>
    </main>
  );
};

export default StepProveMnemonic;
