/* @flow */
import type { ElementRef } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component } from 'react';

import type { CleaveOptions } from '~core/Fields/Input/types';

import { asField } from '~core/Fields';
import { InputComponent } from '~core/Fields/Input';
import { getMainClasses } from '~utils/css';

import styles from './SingleLineEdit.css';

type Appearance = {};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Extra node to render on the top right in the label */
  extra?: Node,
  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions,
  /** Input field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: ?HTMLElement) => void,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** The maximum length of the input value. If provided, remaining character count will be displayed */
  maxLength?: number,
  /** Placeholder for input */
  placeholder?: string | MessageDescriptor,
  /** Values for placeholder text (react-intl interpolation) */
  placeholderValues?: { [string]: string },
  /** Should the component be read only */
  readOnly?: boolean,
  /** Status text */
  status?: string | MessageDescriptor,
  /** Values for status text (react-intl interpolation) */
  statusValues?: { [string]: string },
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** Will be injected by `asField`, or must be supplied if unconnected */
  $value: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** onBlur callback */
  onBlur?: (event: any) => void,
  /** Will be injected by `asField`, or must be manually supplied if unconnected */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
};

type State = {
  isEditing: boolean,
};

class SingleLineEdit extends Component<Props, State> {
  inputRef: ElementRef<typeof HTMLInputElement>;

  static defaultProps = {
    readOnly: false,
  };

  static displayName = 'SingleLineEdit';

  state = {
    isEditing: false,
  };

  componentWillUnmount() {
    if (document.body) {
      document.body.removeEventListener('click', this.handleOutsideClick, true);
    }
  }

  handleOnBlur = (evt: SyntheticFocusEvent<HTMLInputElement>) => {
    const { onBlur } = this.props;
    this.setIsEditing(false);
    if (onBlur) {
      onBlur(evt);
    }
  };

  handleOnChange = () => {
    const { maxLength, $value, setValue } = this.props;
    if (maxLength) {
      if ($value.length > maxLength) {
        setValue($value.slice(0, maxLength));
      }
    }
  };

  handleOnHeadingClick = () => {
    this.setIsEditing(true);
  };

  handleOnHeadingKeyUp = () => {
    this.setIsEditing(true);
  };

  handleOutsideClick = (evt: MouseEvent) => {
    if (
      this.inputRef &&
      evt.target instanceof Node &&
      !this.inputRef.contains(evt.target)
    ) {
      this.setIsEditing(false);
    }
  };

  setInputFocus = () => {
    this.inputRef.focus();
  };

  setInputRef = (node: ?HTMLInputElement) => {
    if (node) {
      this.inputRef = node;
    }
    this.setInputFocus();
  };

  setIsEditing = (isEditing: boolean) => {
    const { readOnly } = this.props;
    if (readOnly) {
      const { isEditing: currentEditingState } = this.state;
      if (currentEditingState) {
        this.setState({
          isEditing: false,
        });
      }
      return;
    }
    this.setState({
      isEditing,
    });
    if (isEditing) {
      if (document.body) {
        document.body.addEventListener('click', this.handleOutsideClick, true);
      }
    } else {
      const { $value, setValue } = this.props;
      if ($value.trim() === '') {
        /*
         * This ensures the heading is always clickable to enter editing mode.
         * For instance, in the case of only spaces entered
         */
        setValue('');
      }
      if (document.body) {
        document.body.removeEventListener(
          'click',
          this.handleOutsideClick,
          true,
        );
      }
    }
  };

  render() {
    const {
      appearance,
      elementOnly,
      $error,
      formattingOptions,
      formatIntl,
      $id,
      innerRef,
      maxLength,
      onBlur,
      name,
      placeholder,
      placeholderValues,
      readOnly,
      setError,
      setValue,
      $touched,
      $value,
      ...rest
    } = this.props;

    const inputProps = {
      'aria-invalid': $error ? true : null,
      formattingOptions,
      id: $id,
      maxLength,
      name,
      onBlur: this.handleOnBlur,
      placeholder,
      value: $value,
      ...rest,
    };
    const { isEditing } = this.state;
    const placeholderText =
      typeof placeholder == 'object'
        ? formatIntl(placeholder, placeholderValues)
        : placeholder;
    return (
      <div
        className={getMainClasses(appearance, styles, {
          hasReachedMaxLength: $value.length === maxLength,
          hasValue: !!$value,
          readOnly: !!readOnly,
        })}
      >
        {isEditing ? (
          <div className={styles.inputContainer}>
            <InputComponent {...inputProps} innerRef={this.setInputRef} />
            {!!maxLength && (
              <span className={styles.maxLengthText}>
                {$value.length}/{maxLength}
              </span>
            )}
          </div>
        ) : (
          <div className={styles.notEditingValueWrapper}>
            <div
              className={styles.notEditingValueContainer}
              onClick={this.handleOnHeadingClick}
              onKeyUp={this.handleOnHeadingKeyUp}
              tabIndex={0}
              role="textbox"
            >
              <p
                className={styles.notEditingValue}
                title={$value || placeholderText}
              >
                {$value || placeholderText}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default asField({
  initialValue: '',
})(SingleLineEdit);
