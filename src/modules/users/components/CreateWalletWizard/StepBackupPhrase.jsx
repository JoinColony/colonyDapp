/* @flow */

import React, { Component, Fragment } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import styles from './StepBackupPhrase.css';

import type { WizardProps } from '~core/Wizard';

import Heading from '~core/Heading';
import Button from '~core/Button';
import { Form } from '~core/Fields';

type FormValues = {
  mnemonic: string,
};

type Props = WizardProps<FormValues>;

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
      wizardValues: { mnemonic },
    } = this.props;
    copy(mnemonic);
    this.setState({ copied: true });
    this.timeout = setTimeout(() => this.setState({ copied: false }), 4000);
  };

  render() {
    const {
      nextStep,
      previousStep,
      wizardForm,
      wizardValues: { mnemonic },
    } = this.props;
    const { copied } = this.state;

    return (
      <main className={styles.content}>
        <Form onSubmit={nextStep} {...wizardForm}>
          {() => (
            <Fragment>
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
                  onClick={() => this.copyToClipboard()}
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
                  onClick={() => previousStep()}
                />
                <Button
                  type="submit"
                  appearance={{ theme: 'danger' }}
                  text={MSG.confirmButton}
                  data-test="confirmCreatedPhraseBackupButton"
                />
              </div>
            </Fragment>
          )}
        </Form>
      </main>
    );
  }
}

export default StepBackupPhrase;
