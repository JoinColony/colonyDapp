/* @flow */

import React from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { defineMessages } from 'react-intl';

import type { FormProps } from '~types/forms';

import styles from './BackupPhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.BackupPhrase.heading',
    defaultMessage: 'Let’s make an alternative Backup',
  },
  subTitle: {
    id: 'CreateWallet.BackupPhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'We do not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.',
  },
  confirmButton: {
    id: 'CreateWallet.BackupPhrase.confirmButton',
    defaultMessage: 'I’ve created a backup',
  },
  backButton: {
    id: 'CreateWallet.BackupPhrase.backButton',
    defaultMessage: 'Back',
  },
  backupButton: {
    id: 'CreateWallet.BackupPhrase.backupButton',
    defaultMessage: 'Backup Mnemonic',
  },
  titleBox: {
    id: 'CreateWallet.BackupPhrase.titleBox',
    defaultMessage: `Your Mnemonic Phrase`,
  },
});

type Props = FormProps<CustomProps>;

const BackupPhrase = ({
  nextStep,
  previousStep,
  handleSubmit,
  passphrase,
}: Props) => (
  <section className={`${styles.content}`}>
    <div className={`${styles.title}`}>
      <Heading appearance={{ size: 'thinner' }} text={MSG.heading} />
    </div>
    <div className={`${styles.subtitle}`}>
      <Heading appearance={{ size: 'thinNormal' }} text={MSG.subTitle} />
    </div>
    <Heading
      appearance={{ size: 'boldSmall' }}
      text={MSG.titleBox}
      className={`${styles.heading}`}
    />
    <div className={`${styles.greyBox}`}>{passphrase}</div>
    <div className={`${styles.backupButton}`}>
      <Button appearance={{ theme: 'primary' }} value={MSG.backupButton} />
    </div>
    <div className={`${styles.buttonsForBox}`}>
      <Button
        appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
        onClick={handleSubmit(previousStep)}
        value={MSG.backButton}
      />
      <Button
        appearance={{ theme: 'danger' }}
        onClick={handleSubmit(nextStep)}
        value={MSG.confirmButton}
      />
    </div>
  </section>
);

// get pass phrase from previous step
// will be passed in as props
const selector = formValueSelector('create_wallet');
const ConnectedBackupPhrase = connect(state => ({
  passphrase: selector(state, 'pass_phrase_outer'),
}))(BackupPhrase);

export default ConnectedBackupPhrase;

export const reduxFormOpts = {
  form: 'create_wallet',
  forceUnregisterOnUnmount: true,
};
