/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';

import type { FormProps } from '~types/forms';
import { Field as ReduxFormField } from 'redux-form';

import styles from './CreatePhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';
import PassphraseGenerator from '../../../core/components/PassphraseGenerator';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.CreatePhrase.heading',
    defaultMessage: 'Great, let’s get started by creating your new wallet!',
  },
  subTitle: {
    id: 'CreateWallet.CreatePhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'The key to your wallet is your mnemonic phrase. Write it down and put it in a safe place; you’ll use it to access Colony. Once you’ve safely stored your mnemonic, we’ll go to the next step.',
  },
  confirmButton: {
    id: 'CreateWallet.CreatePhrase.confirmButton',
    defaultMessage: 'I’ve safely stored it',
  },
  backButton: {
    id: 'CreateWallet.CreatePhrase.backButton',
    defaultMessage: 'Back',
  },
});

type CustomProps = {
  nextStep: () => void,
  previousStep: () => void,
  handleSubmit: () => void,
};

type Props = FormProps<CustomProps>;

const CreatePhrase = ({ nextStep, previousStep, handleSubmit }: Props) => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
    </div>
    <div className={`${styles.greyBox}`}>
      <ReduxFormField
        name="pass_phrase_outer"
        component={PassphraseGenerator}
      />
    </div>
    <div className={`${styles.buttonsForBox}`}>
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
        value={MSG.backButton}
        onClick={handleSubmit(previousStep)}
      />
      <Button
        appearance={{ theme: 'danger' }}
        onClick={handleSubmit(nextStep)}
        onSubmit={handleSubmit}
        value={MSG.confirmButton}
      />
    </div>
  </section>
);

export default CreatePhrase;

export const reduxFormOpts = {
  form: 'create_wallet',
  forceUnregisterOnUnmount: true,
};
