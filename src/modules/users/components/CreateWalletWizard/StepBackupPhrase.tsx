import React, { useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import styles from './StepBackupPhrase.css';
import { WizardProps } from '~core/Wizard';
import Heading from '~core/Heading';
import Button from '~core/Button';
import { Form } from '~core/Fields';

const MSG = defineMessages({
  heading: {
    id: 'CreateWallet.StepBackupPhrase.heading',
    defaultMessage: 'Let’s make an alternative Backup',
  },
  subTitle: {
    id: 'CreateWallet.StepBackupPhrase.subTitle',
    defaultMessage: `Colony does not store your mnemonic phrase anywhere which means we cannot recover it for any reason. Make an alternative backup to keep it extra safe.`,
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

interface FormValues {
  mnemonic: string;
}

type Props = WizardProps<FormValues>;

const displayName = 'users.CreateWalletWizard.StepBackupPhrase';

const StepBackupPhrase = ({
  nextStep,
  previousStep,
  wizardForm,
  wizardValues: { mnemonic },
}: Props) => {
  const timeout = useRef<number>();
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = useCallback(() => {
    copy(mnemonic);
    setCopied(true);
    if (window) {
      timeout.current = window.setTimeout(() => setCopied(false), 4000);
    }
  }, [mnemonic]);

  useEffect(
    () => () => {
      if (window) {
        window.clearTimeout(timeout.current);
      }
    },
    [],
  );

  return (
    <main className={styles.content}>
      <Form onSubmit={nextStep} {...wizardForm}>
        {() => (
          <>
            <div className={styles.title}>
              <Heading
                appearance={{ size: 'medium', weight: 'thin' }}
                text={MSG.heading}
              />
            </div>
            <div className={styles.subtitle}>
              <Heading
                appearance={{ size: 'normal', weight: 'thin' }}
                text={MSG.subTitle}
              />
            </div>
            <div className={styles.mnemonicInstructions}>
              <Heading
                appearance={{ margin: 'none', size: 'small', weight: 'bold' }}
                text={MSG.titleBox}
              />
              <Button
                appearance={{ theme: 'blue' }}
                disabled={copied}
                onClick={copyToClipboard}
                text={{ ...MSG.copyButton }}
                textValues={{ copied }}
              />
            </div>
            <div className={styles.greyBox}>{mnemonic}</div>
            <div className={styles.divider} />
            <div className={styles.buttonsForBox}>
              <Button
                appearance={{ theme: 'ghost' }}
                text={MSG.backButton}
                onClick={previousStep}
              />
              <Button
                type="submit"
                appearance={{ theme: 'danger' }}
                text={MSG.confirmButton}
                data-test="confirmCreatedPhraseBackupButton"
              />
            </div>
          </>
        )}
      </Form>
    </main>
  );
};

StepBackupPhrase.displayName = displayName;

export default StepBackupPhrase;
