import React, { useCallback, useEffect, useRef, useState } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import { FieldEnhancedProps } from '~core/Fields/types';

import styles from './MnemonicGenerator.css';
import InputLabel from '../Fields/InputLabel';
import asField from '../Fields/asField';
import Button from '../Button';
import Heading from '../Heading';

const MSG = defineMessages({
  buttonRefresh: {
    id: 'MnemonicGenerator.button.refresh',
    defaultMessage: 'Refresh',
  },
  buttonCopy: {
    id: 'MnemonicGenerator.button.copy',
    defaultMessage: `{copied, select,
      true {Copied}
      false {Copy}
    }`,
  },
  titleBox: {
    id: 'MnemonicGenerator.button.titleBox',
    defaultMessage: 'Your Mnemonic Phrase',
  },
});

interface Props {
  /** Whether the field is disabled (no input possible) */
  disabled?: boolean;

  /** Function to generate the mnemonic phrase (can return a string or a promise) */
  generateFn: () => string | Promise<string>;
}

const displayName = 'MnemonicGenerator';

const MnemonicGenerator = ({
  disabled,
  elementOnly,
  help,
  $id,
  label,
  $value,
  $error,
  /* eslint-disable @typescript-eslint/no-unused-vars */
  connect,
  formatIntl,
  generateFn,
  isSubmitting,
  name,
  $touched,
  onBlur,
  setError,
  setValue,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: Props & FieldEnhancedProps) => {
  const timeout = useRef<number>();

  const [isCopied, setIsCopied] = useState<boolean>(false);

  const generateMnemonic = useCallback(() => {
    const res = generateFn();
    if (res instanceof Promise && !!res.then && setValue) {
      res.then((phrase) => setValue(phrase));
    } else if (setValue) {
      setValue(res);
    }
  }, [generateFn, setValue]);

  const copyToClipboard = useCallback(() => {
    if (!$value) return;
    copy($value);
    setIsCopied(true);
    if (window) {
      timeout.current = window.setTimeout(() => setIsCopied(false), 4000);
    }
  }, [$value]);

  useEffect(() => {
    if (!$value) {
      generateMnemonic();
    }

    return () => {
      if (window) {
        window.clearTimeout(timeout.current);
      }
    };
  }, [$value, generateMnemonic]);

  return (
    <div {...props}>
      <div className={styles.buttons}>
        <Heading
          appearance={{ size: 'small', weight: 'bold' }}
          text={MSG.titleBox}
          className={styles.heading}
        />
        <div>
          <Button
            appearance={{ theme: 'ghost' }}
            type="button"
            onClick={generateMnemonic}
            text={MSG.buttonRefresh}
          />
          <Button
            appearance={{ theme: 'ghost' }}
            type="button"
            disabled={isCopied}
            onClick={copyToClipboard}
            text={{ ...MSG.buttonCopy }}
            textValues={{ copied: isCopied }}
          />
        </div>
      </div>
      <div
        className={styles.main}
        aria-invalid={!!$error}
        aria-disabled={disabled}
      >
        {!elementOnly && <InputLabel inputId={$id} label={label} help={help} />}
        <div className={styles.generator}>
          <span className={styles.mnemonic} data-test="mnemonicPhrase">
            {$value}
          </span>
        </div>
      </div>
    </div>
  );
};

MnemonicGenerator.displayName = displayName;

export default asField<Props>()(MnemonicGenerator);
