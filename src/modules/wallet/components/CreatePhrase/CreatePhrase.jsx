/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import PropTypes from 'prop-types';

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
    defaultMessage: 'Ive safely stored it',
  },
  backButton: {
    id: 'CreateWallet.CreatePhrase.backButton',
    defaultMessage: 'Back',
  },
  refreshButton: {
    id: 'CreateWallet.CreatePhrase.refreshButton',
    defaultMessage: 'Refresh',
  },
  copyButton: {
    id: 'CreateWallet.CreatePhrase.copyButton',
    defaultMessage: 'Copy',
  },
});

const CreatePhrase = () => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
    </div>
    <div className={`${styles.greyBox}`}>
      <PassphraseGenerator />
    </div>
    <div className={`${styles.buttonsForBox}`}>
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
        value={MSG.backButton}
      />
      <Button appearance={{ theme: 'danger' }} value={MSG.confirmButton} />
    </div>
  </section>
);

export default CreatePhrase;
