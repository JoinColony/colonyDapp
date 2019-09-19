import { MessageDescriptor, MessageValues, defineMessages } from 'react-intl';
import React, { Component } from 'react';
import copy from 'copy-to-clipboard';

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
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean;

  /** Whether the field is disabled (no input possible) */
  disabled?: boolean;

  /** Just render the element without label */
  elementOnly?: boolean;

  /** Function to generate the mnemonic phrase (can return a string or a promise) */
  generateFn: () => string | Promise<string>;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Label text */
  label: string | MessageDescriptor;

  /** Input field name (form variable) */
  name: string;

  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean;

  /** @ignore Will be injected by `asField` */
  $id: string;

  /** @ignore Will be injected by `asField` */
  $error?: string;

  /** @ignore Will be injected by `asField` */
  $value?: string;

  /** @ignore Will be injected by `asField` */
  $touched?: boolean;

  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string;

  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void;

  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void;

  /** @ignore Standard input field property */
  onBlur: Function;
}

interface State {
  copied: boolean;
}

class MnemonicGenerator extends Component<Props, State> {
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
    if (res instanceof Promise && !!res.then) {
      res.then(phrase => setValue(phrase));
    } else {
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
              appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
              type="button"
              onClick={this.generateMnemonic}
              text={MSG.buttonRefresh}
            />
            <Button
              appearance={{ theme: 'ghost', colorSchema: 'noBorderBlue' }}
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
          {!elementOnly && <InputLabel id={$id} label={label} help={help} />}
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

export default (asField() as any)(MnemonicGenerator);
