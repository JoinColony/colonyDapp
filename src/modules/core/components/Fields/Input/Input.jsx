/* @flow */

import React, { Component } from 'react';
import Cleave from 'cleave.js/react';

import { getMainClasses } from '$utils/css';

import styles from './Input.css';

import type { CleaveHTMLInputElement, CleaveOptions, FieldComponentProps } from '../flowTypes';

import InputLabel from '../InputLabel';

/**
 * An input component (to be used as a redux form field) that is basically a standard (text|email|number) Input component.
 * Can receive formatting options leveraging cleave.js
 *
 * @method Input
 *
 * Can receive all the Field properties plus:
 *
 * @param {object} format Cleave.js formatting options
 */

type CustomProps = {
  formattingOptions?: CleaveOptions,
  disabled?: boolean,
};

type Props = FieldComponentProps<CustomProps>;

class Input extends Component<Props> {
  // TODO: exact
  handleBlur: Function;
  handleChange: Function;
  handleFocus: Function;
  handleRef: Function;
  inputElm: HTMLInputElement;
  static displayName = 'core.Fields.Input';
  static defaultProps = {
    appearance: {},
  };
  constructor(props: Props) {
    super(props);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleRef = this.handleRef.bind(this);
  }
  handleBlur(evt: SyntheticEvent<CleaveHTMLInputElement>) {
    return this.props.input.onBlur(evt.currentTarget.rawValue);
  }
  handleChange(evt: SyntheticEvent<CleaveHTMLInputElement>) {
    return this.props.input.onChange(evt.currentTarget.rawValue);
  }
  // We're using a simple object here because redux-form is using its
  // own event definition which doesn't make any sense
  handleFocus(evt: Object) {
    const { onFocus } = this.props.input;
    const { length } = evt.currentTarget.value;
    setTimeout(() => {
      if (!this.inputElm) return;
      this.inputElm.selectionStart = length;
      this.inputElm.selectionEnd = length;
    });
    return onFocus(evt);
  }
  handleRef(elm: HTMLInputElement) {
    this.inputElm = elm;
  }
  render() {
    const {
      appearance,
      elementOnly,
      error,
      hasError,
      help,
      input,
      inputProps,
      passthroughProps: { formattingOptions, disabled, ...props },
      label,
      meta: { active },
    } = this.props;
    return (
      <div
        className={getMainClasses(appearance, styles, { active })}
        aria-invalid={hasError}
        aria-disabled={disabled}
      >
        {!elementOnly && label ?
          <InputLabel id={inputProps.id} label={label} error={hasError && error} help={help} appearance={appearance} />
          :
          null
        }
        { formattingOptions ?
          <Cleave
            {...props}
            {...inputProps}
            {...input}
            className={styles.input}
            options={formattingOptions}
            htmlRef={this.handleRef}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            value={active ? input.value : (input.value || inputProps.placeholder)}
          />
          :
            <input
              {...props}
              {...inputProps}
              {...input}
              className={styles.input}
            />
        }
        {appearance && appearance.direction === 'horizontal' ?
          <span className={styles.error}>{hasError && error}</span>
          :
          null
        }
      </div>
    );
  }
}

export default Input;
