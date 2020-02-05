import React, { Component, FocusEvent } from 'react';
import { CleaveOptions } from 'cleave.js/options';

import { asField } from '~core/Fields';
import { InputComponent } from '~core/Fields/Input';
import { Props as InputComponentProps } from '~core/Fields/Input/InputComponent';
import { AsFieldEnhancedProps } from '~core/Fields/types';
import { getMainClasses } from '~utils/css';

import styles from './SingleLineEdit.css';

interface Props {
  /** Extra node to render on the top right in the label */
  extra?: Node;

  /** Options for cleave.js formatting (see [this list](https://github.com/nosir/cleave.js/blob/master/doc/options.md)) */
  formattingOptions?: CleaveOptions;

  /** Pass a ref to the `<input>` element */
  innerRef?: (ref: HTMLElement | null) => void;

  /** The maximum length of the input value. If provided, remaining character count will be displayed */
  maxLength?: number;

  /** Should the component be read only */
  readOnly?: boolean;
}

interface State {
  isEditing: boolean;
}

class SingleLineEdit extends Component<Props & AsFieldEnhancedProps, State> {
  inputRef: any;

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

  handleOnBlur = (evt: FocusEvent<HTMLInputElement>) => {
    const { onBlur } = this.props;
    this.setIsEditing(false);
    if (onBlur) {
      onBlur(evt);
    }
  };

  handleOnChange = () => {
    const { maxLength, $value, setValue } = this.props;
    if (maxLength && setValue && $value.length > maxLength) {
      setValue($value.slice(0, maxLength));
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
      !(this.inputRef as any).contains(evt.target)
    ) {
      this.setIsEditing(false);
    }
  };

  setInputFocus = () => {
    this.inputRef.focus();
  };

  setInputRef = (node: HTMLInputElement | null) => {
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
      if (setValue && $value.trim() === '') {
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
      $error,
      formattingOptions,
      $id,
      maxLength,
      name,
      placeholder,
      readOnly,
      /* eslint-disable @typescript-eslint/no-unused-vars */
      elementOnly,
      innerRef,
      isSubmitting,
      formatIntl,
      onBlur,
      setError,
      setValue,
      $touched,
      $value,
      connect,
      /* eslint-enable @typescript-eslint/no-unused-vars */
      ...rest
    } = this.props;

    const inputProps = {
      'aria-invalid': !!$error,
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
    return (
      <div
        className={getMainClasses({}, styles, {
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
                title={$value || placeholder}
              >
                {$value || placeholder}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default asField<Props, InputComponentProps>({
  initialValue: '',
})(SingleLineEdit);
