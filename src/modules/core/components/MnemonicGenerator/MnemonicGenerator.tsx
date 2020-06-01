import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  HTMLAttributes,
} from 'react';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { useField } from 'formik';
import nanoid from 'nanoid';
import copy from 'copy-to-clipboard';

import { SimpleMessageValues } from '~types/index';

import styles from './MnemonicGenerator.css';
import InputLabel from '../Fields/InputLabel';
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

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Whether the field is disabled (no input possible) */
  disabled?: boolean;

  /** Should render the select without a label */
  elementOnly?: boolean;

  /** Function to generate the mnemonic phrase (can return a string or a promise) */
  generateFn: () => string | Promise<string>;

  /** Help text */
  help?: string | MessageDescriptor;

  /** Help text values for intl interpolation */
  helpValues?: SimpleMessageValues;

  /** Html id attribute */
  id?: string;

  /** Label text */
  label: string | MessageDescriptor;

  /** Label text values for intl interpolation */
  labelValues?: SimpleMessageValues;

  /** Html name attribute */
  name: string;
}

const displayName = 'MnemonicGenerator';

const MnemonicGenerator = ({
  disabled,
  elementOnly,
  generateFn,
  help,
  helpValues,
  id: idProp,
  label,
  labelValues,
  name,
  ...props
}: Props) => {
  const timeout = useRef<number>();

  const [id] = useState(idProp || nanoid());
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [, { error, value }, { setValue }] = useField(name);

  const generateMnemonic = useCallback(() => {
    const res = generateFn();
    if (res instanceof Promise && !!res.then) {
      res.then((phrase) => setValue(phrase));
    } else {
      setValue(res);
    }
  }, [generateFn, setValue]);

  const copyToClipboard = useCallback(() => {
    if (!value) return;
    copy(value);
    setIsCopied(true);
    if (window) {
      timeout.current = window.setTimeout(() => setIsCopied(false), 4000);
    }
  }, [value]);

  useEffect(() => {
    if (!value) {
      generateMnemonic();
    }

    return () => {
      if (window) {
        window.clearTimeout(timeout.current);
      }
    };
  }, [value, generateMnemonic]);

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
        aria-invalid={!!error}
        aria-disabled={disabled}
      >
        <InputLabel
          inputId={id}
          label={label}
          labelValues={labelValues}
          help={help}
          helpValues={helpValues}
          screenReaderOnly={elementOnly}
        />
        <div className={styles.generator}>
          <span className={styles.mnemonic} data-test="mnemonicPhrase">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
};

MnemonicGenerator.displayName = displayName;

export default MnemonicGenerator;
