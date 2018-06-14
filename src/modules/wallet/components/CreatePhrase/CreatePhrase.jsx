/* @flow */

import React from 'react';
import { defineMessages } from 'react-intl';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import styles from './CreatePhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.CreatePhrase.heading',
    defaultMessage: 'Great, let’s get started by creating your new wallet!',
  },
  subTitle: {
    id: 'CreateWallet.CreatePhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Each Colony account is accessed through an associated Ethereum wallet. Each Colony account is accessed through an associated Ethereum wallet. You can use an existing wallet that you own, or create a new wallet below.',
  },
  titleBox: {
    id: 'CreateWallet.CreatePhrase.titleBox',
    defaultMessage: 'Your Mnemonic Phrase',
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
    {/* Heading above grey box */}
    <div className={`${styles.buttonsForBox}`}>
      <Heading
        appearance={{ size: 'boldSmall' }}
        text={MSG.titleBox}
        className={`${styles.rowOutlier}`}
      />
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
        value={MSG.copyButton}
      />
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
        value={MSG.refreshButton}
      />
    </div>
    <div className={`${styles.greyBox}`} />
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
