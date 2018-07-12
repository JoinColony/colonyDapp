/* @flow */

// $FlowFixMe
import { create } from 'colony-wallet/software';
import React, { Component } from 'react';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import styles from './PassphraseGenerator.css';

import { InputLabel } from '../Fields';
import Button from '../Button';
import Heading from '../Heading';

const MSG = defineMessages({
  buttonRefresh: {
    id: 'PassphraseGenerator.button.refresh',
    defaultMessage: 'Refresh',
  },
  buttonCopy: {
    id: 'PassphraseGenerator.button.copy',
    defaultMessage: `Copy`,
  },
  titleBox: {
    id: 'PassphraseGenerator.button.titleBox',
    defaultMessage: `Your Mnemonic Phrase`,
  },
});

type Props = {
  elementOnly: boolean,
  label: string,
  hasError: boolean,
  error: string,
  help: string,
  input: {
    id: any,
    value: string,
    onChange: any,
    disabled: boolean,
  },
};
type State = {
  copied: boolean,
};

class PassphraseGenerator extends Component<Props, State> {
  static displayName = 'core.PassphraseGenerator';

  state = { copied: false };

  componentDidMount() {
    if (!this.props.input.value) {
      this.generatePassphrase();
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }
  timeout = undefined;

  generatePassphrase = () => {
    const { input: { onChange } } = this.props;

    create().then(wallet => {
      onChange(wallet.mnemonic);
    });
  };
  copyToClipboard = () => {
    copy(this.props.input.value);
    this.setState({ copied: true });
    this.timeout = setTimeout(() => this.setState({ copied: false }), 4000);
  };
  render() {
    const {
      elementOnly,
      error,
      hasError,
      help,
      input: { id, value, disabled },
      label,
    } = this.props;
    const { copied } = this.state;
    return (
      <div>
        <div className={styles.buttons}>
          <Heading
            appearance={{ size: 'small', width: 'bold' }}
            text={MSG.titleBox}
            className={styles.heading}
          />
          <div>
            <Button
              appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
              type="button"
              onClick={this.generatePassphrase}
              value={MSG.buttonRefresh}
            />
            <Button
              appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
              type="button"
              disabled={copied}
              onClick={this.copyToClipboard}
              value={{ ...MSG.buttonCopy, values: { copied } }}
            />
          </div>
        </div>
        <div
          className={styles.main}
          aria-invalid={hasError}
          aria-disabled={disabled}
        >
          {!elementOnly &&
            label && (
              <InputLabel
                id={id}
                label={label}
                error={hasError && error}
                help={help}
              />
            )}
          <div className={styles.generator}>
            <span className={styles.mnemonic} data-wd-hook="user-passphrase">
              {value}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default PassphraseGenerator;
