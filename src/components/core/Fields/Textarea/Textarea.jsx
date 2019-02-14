/* @flow */

import type { Node } from 'react';
import type { MessageDescriptor, MessageValues } from 'react-intl';

import React, { Component } from 'react';
import cx from 'classnames';

import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import asField from '../asField';
import InputLabel from '../InputLabel';
import InputStatus from '../InputStatus';

type Appearance = {
  theme?: 'fat',
  align?: 'right',
  layout?: 'inline',
  resizable?: 'both' | 'horizontal' | 'vertical',
  direction?: 'horizontal',
  colorSchema?: 'dark' | 'transparent',
  size?: 'small',
};

type Props = {|
  /** Appearance object */
  appearance?: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<textarea>` element without label */
  elementOnly?: boolean,
  /** Extra node to render on the top right in the label */
  extra?: Node,
  /** Textarea field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: ?HTMLElement) => void,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** Maximum length (will show counter) */
  maxLength?: number,
  /** Placeholder for input */
  placeholder?: string | MessageDescriptor,
  /** Status text (if applicable) */
  status?: string | MessageDescriptor,
  /** @ignore Will be injected by `asField` */
  $id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
  /** @ignore Will be injected by `asField` */
  isSubmitting?: boolean,
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: MessageValues,
  ) => string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
  /** @ignore Standard textarea field property */
  onChange: Function,
|};

class Textarea extends Component<Props> {
  static displayName = 'Textarea';

  static defaultProps = {
    appearance: {},
  };

  renderTextarea = inputProps => {
    const { innerRef, maxLength, ...props } = inputProps;
    const { $value } = this.props;
    const length = $value ? $value.length : 0;
    return (
      <div className={styles.textareaWrapper}>
        <textarea ref={innerRef} {...props} maxLength={maxLength} />
        {maxLength && (
          <span
            className={cx(styles.count, {
              [styles.limit]: length === maxLength,
            })}
          >
            {length}/{maxLength}
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      $id,
      $value,
      $error,
      $touched,
      appearance = {},
      elementOnly,
      formatIntl,
      isSubmitting,
      help,
      extra,
      label,
      maxLength = null,
      name,
      setError,
      setValue,
      status,
      connect,
      ...props
    } = this.props;

    const inputProps = {
      id: $id,
      name,
      'aria-invalid': $error ? true : null,
      className: getMainClasses(appearance, styles),
      maxLength,
      value: $value,
      ...props,
    };

    if (elementOnly) {
      return this.renderTextarea(inputProps);
    }

    return (
      <div className={styles.container}>
        <InputLabel
          appearance={appearance}
          inputId={$id}
          label={label}
          error={$error}
          help={help}
          extra={extra}
        />
        {this.renderTextarea(inputProps)}
        <InputStatus appearance={appearance} status={status} error={$error} />
      </div>
    );
  }
}

export default asField()(Textarea);
