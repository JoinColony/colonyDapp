/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor } from 'react-intl';

import React, { Component, Fragment } from 'react';
import nanoid from 'nanoid';

import { getMainClasses } from '~utils/css';

import InputLabel from '~core/Fields/InputLabel';
import asFieldArray from '~core/Fields/asFieldArray';

import styles from './Checkbox.css';

type Appearance = {
  theme: 'dark',
  direction: 'vertical' | 'horizontal',
};

type Props = {
  appearance?: Appearance,
  /** Additional className for customizing styles */
  className?: string,
  /** Children to render in place of the default label */
  children?: Node,
  /** Disable the input */
  disabled: boolean,
  /** Display the element without label */
  elementOnly?: boolean,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** Input field name (form variable) */
  name: string,
  /** Input field value */
  value: string,
  /** Standard input field property */
  onChange?: Function,
  /** @ignore injected by `asFieldArray` */
  form: { [string]: any },
  /** @ignore injected by `asFieldArray` */
  push: (value: string) => void,
  /** @ignore injected by `asFieldArray` */
  remove: (value: string) => void,
};

type State = {
  inputId: string,
};

class Checkbox extends Component<Props, State> {
  static displayName = 'Checkbox';

  static defaultProps = {
    appearance: {
      direction: 'vertical',
    },
    checked: false,
    disabled: false,
    elementOnly: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      inputId: nanoid(),
    };
  }

  handleOnChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const {
      push,
      remove,
      name,
      value,
      form: { values },
      onChange,
    } = this.props;
    const idx = values[name].indexOf(value);
    if (idx >= 0) {
      remove(idx);
    } else {
      push(value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  render() {
    const {
      appearance,
      children,
      className,
      disabled,
      elementOnly,
      form: { values },
      help,
      label,
      value,
      name,
    } = this.props;
    const { inputId } = this.state;
    const isChecked = values[name].indexOf(value) >= 0;
    const mainClasses = getMainClasses(appearance, styles, {
      isChecked,
      disabled,
    });
    const classNames = className ? `${mainClasses} ${className}` : mainClasses;
    return (
      <label className={classNames} htmlFor={elementOnly ? inputId : null}>
        <Fragment>
          <input
            id={inputId}
            className={styles.delegate}
            name={name}
            type="checkbox"
            disabled={disabled}
            onChange={this.handleOnChange}
            aria-disabled={disabled}
            aria-checked={isChecked}
          />
          <span className={styles.checkbox}>
            <span className={styles.checkmark} />
          </span>
          {!elementOnly && !!label ? (
            <InputLabel
              inputId={inputId}
              label={label}
              help={help}
              appearance={{ direction: 'horizontal' }}
            />
          ) : (
            label || children
          )}
        </Fragment>
      </label>
    );
  }
}

export default asFieldArray()(Checkbox);
