/* @flow */

import type { FormikProps } from 'formik';

import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import styles from './StepBackupPhrase.css';

import Heading from '../../../core/components/Heading';
import Button from '../../../core/components/Button';

import type { SubmitFn } from '../../../core/components/Wizard';

type FormValues = {
  mnemonic: string,
};

type Props = {
  previousStep: () => void,
} & FormikProps<FormValues>;

type State = {
  copied: boolean,
};

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepBackupPhrase.heading',
    defaultMessage: 'Let’s make an alternative Backup',
  },
  subTitle: {
    id: 'CreateWallet.StepBackupPhrase.subTitle',
    defaultMessage:
      /* eslint-disable max-len */
      'Colony does not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.',
  },
  confirmButton: {
    id: 'CreateWallet.StepBackupPhrase.confirmButton',
    defaultMessage: 'I’ve created a backup',
  },
  backButton: {
    id: 'CreateWallet.StepBackupPhrase.backButton',
    defaultMessage: 'Back',
  },
  copyButton: {
    id: 'MnemonicGenerator.button.copy',
    defaultMessage: `{copied, select,
      true {Copied}
      false {Copy}
    }`,
  },
  titleBox: {
    id: 'CreateWallet.StepBackupPhrase.titleBox',
    defaultMessage: 'Your Mnemonic Phrase',
  },
});

class StepBackupPhrase extends Component<Props, State> {
  timeout: TimeoutID;

  state = { copied: false };

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  copyToClipboard = () => {
    const {
      values: { mnemonic },
    } = this.props;
    copy(mnemonic);
    this.setState({ copied: true });
    this.timeout = setTimeout(() => this.setState({ copied: false }), 4000);
  };

  render() {
    const {
      values: { mnemonic },
      previousStep,
    } = this.props;
    const { copied } = this.state;

    return (
      <main className={styles.content}>
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
        <div className={styles.mnemonicInstructions}>
          <Heading
            appearance={{ margin: 'none', size: 'small', width: 'bold' }}
            text={MSG.titleBox}
          />
          <Button
            appearance={{ theme: 'blue' }}
            disabled={copied}
            onClick={this.copyToClipboard}
            text={{ ...MSG.copyButton }}
            textValues={{ copied }}
          />
        </div>
        <div className={styles.greyBox}>{mnemonic}</div>
        <div className={styles.divider} />
        <div className={styles.buttonsForBox}>
          <Button
            appearance={{ theme: 'ghost', colorSchema: 'noBorder' }}
            text={MSG.backButton}
            onClick={previousStep}
          />
          <Button
            type="submit"
            appearance={{ theme: 'danger' }}
            text={MSG.confirmButton}
          />
        </div>
      </main>
    );
  }
}

export const onSubmit: SubmitFn<FormValues> = (values, { nextStep }) =>
  nextStep();

export const Step = StepBackupPhrase;
