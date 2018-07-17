/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React, { Component } from 'react';
import Cleave from 'cleave.js/react';
import cx from 'classnames';

import { getMainClasses } from '~utils/css';

import styles from './Input.css';

import asField from '../asField';
import InputLabel from '../InputLabel';

type Appearance = {
  theme?: 'fat' | 'underlined',
  align?: 'right',
  direction?: 'horizontal',
  colorSchema?: 'dark' | 'transparent',
};

/* Cleave.js options. This is not an extensive list. Just the ones we're using for now */
/* Full list: https://github.com/nosir/cleave.js/blob/master/doc/options.md */
type CleaveOptions = {
  prefix?: string,
  rawValueTrimPrefix?: boolean,
  numeral?: boolean,
  delimiter?: string,
  numeralThousandsGroupStyle?: string,
  numeralDecimalScale?: number,
  numeralPositiveOnly?: boolean,
};

type CleaveHTMLInputElement = HTMLInputElement & { rawValue: string };

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Options for cleave.js formatting */
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
  label: string,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Standard input field property */
  onChange: Function,
};

const displayName = 'Fields.Input';

class Input extends Component<Props> {
  static defaultProps = {
    appearance: {},
  };

  handleChange = (evt: SyntheticEvent<CleaveHTMLInputElement>): void => {
    const {
      props: { onChange },
    } = this;
    // We are reassigning the value here as cleave just adds a `rawValue` prop
    // eslint-disable-next-line no-param-reassign
    evt.currentTarget.value = evt.currentTarget.rawValue;
    if (onChange) onChange(evt);
  };

  renderInput = inputProps => {
    const { formattingOptions, innerRef, ...props } = inputProps;
    if (formattingOptions) {
      return (
        <Cleave
          {...props}
          htmlRef={innerRef}
          options={formattingOptions}
          onChange={this.handleChange}
        />
      );
    }
    return <input ref={innerRef} {...props} />;
  };

  render() {
    const {
      appearance = {},
      elementOnly,
      help,
      $id,
      label,
      name,
      $value,
      $error,
      $touched,
      ...props
    } = this.props;

    const inputProps = {
      id: $id,
      name,
      'aria-invalid': $error ? true : null,
      className: getMainClasses(appearance, styles),
      value: $value,
      ...props,
    };

    if (elementOnly) {
      return this.renderInput(inputProps);
    }
    const containerClasses = cx(styles.container, {
      [styles.containerHorizontal]: appearance.direction === 'horizontal',
    });
    return (
      <div className={containerClasses}>
        <InputLabel
          appearance={appearance}
          inputId={$id}
          label={label}
          error={$error}
          help={help}
        />
        {this.renderInput(inputProps)}
        {appearance.direction === 'horizontal' && $error ? (
          <span className={styles.error}>{$error}</span>
        ) : null}
      </div>
    );
  }
}

Input.displayName = displayName;

export default asField(Input);
