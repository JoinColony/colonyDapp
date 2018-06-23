/* @flow */

import { create } from 'colony-wallet/software';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages } from 'react-intl';
import copy from 'copy-to-clipboard';

import styles from './PassphraseGenerator.css';

import { InputLabel } from '../Fields';
import Button from '../Button';
import Heading from '../Heading';

const lightwallet = import(/* webpackChunkName: "lib0" */ 'eth-lightwallet');

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

class PassphraseGenerator extends Component {
  static displayName = 'core.PassphraseGenerator';

  constructor(props) {
    super(props);
    this.state = { copied: false };
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.generatePassphrase = this.generatePassphrase.bind(this);
  }
  componentDidMount() {
    if (!this.props.input.value) {
      this.generatePassphrase();
    }
  }
  copyToClipboard() {
    copy(this.props.input.value);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 4000);
  }
  generatePassphrase() {
    const { input: { onChange } } = this.props;
    lightwallet.then(({ keystore: { generateRandomSeed } }) =>
      onChange(generateRandomSeed()),
    );
  }
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
            appearance={{ size: 'boldSmall' }}
            text={MSG.titleBox}
            className={`${styles.heading}`}
          />
          {!this.state.copied ? (
            <div className="buttonContainer">
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
          ) : null}
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

PassphraseGenerator.propTypes = {
  /*   elementOnly: PropTypes.bool,
  label: PropTypes.string,
  hasError: PropTypes.bool,
  error: PropTypes.string,
  help: PropTypes.string,
  input: PropTypes.object, // eslint-disable-line react/forbid-prop-types */
};

export default PassphraseGenerator;
