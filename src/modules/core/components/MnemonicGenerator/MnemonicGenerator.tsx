import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import { AsFieldEnhancedProps } from '~core/Fields/types';

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

interface State {
  copied: boolean;
}

class MnemonicGenerator extends Component<Props & AsFieldEnhancedProps, State> {
  timeout: any;

  static displayName = 'MnemonicGenerator';

  state = { copied: false };

  componentDidMount() {
    const { $value } = this.props;
    if (!$value) {
      this.generateMnemonic();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  generateMnemonic = (): void => {
    const { generateFn, setValue } = this.props;
    const res = generateFn();
    if (res instanceof Promise && !!res.then && setValue) {
      res.then(phrase => setValue(phrase));
    } else if (setValue) {
      setValue(res);
    }
  };

  copyToClipboard = () => {
    const { $value } = this.props;
    if (!$value) return;
    copy($value);
    this.setState({ copied: true });
    this.timeout = setTimeout(() => this.setState({ copied: false }), 4000);
  };

  render() {
    const {
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
    } = this.props;
    const { copied } = this.state;
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
              onClick={this.generateMnemonic}
              text={MSG.buttonRefresh}
            />
            <Button
              appearance={{ theme: 'ghost' }}
              type="button"
              disabled={copied}
              onClick={this.copyToClipboard}
              text={{ ...MSG.buttonCopy }}
              textValues={{ copied }}
            />
          </div>
        </div>
        <div
          className={styles.main}
          aria-invalid={!!$error}
          aria-disabled={disabled}
        >
          {!elementOnly && (
            <InputLabel inputId={$id} label={label} help={help} />
          )}
          <div className={styles.generator}>
            <span className={styles.mnemonic} data-test="mnemonicPhrase">
              {$value}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default asField<Props>()(MnemonicGenerator);
