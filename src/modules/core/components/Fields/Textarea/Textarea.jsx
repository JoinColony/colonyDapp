/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React, { Component } from 'react';

import { getMainClasses } from '~utils/css';

import styles from './Textarea.css';

import asField from '../asField';
import InputLabel from '../InputLabel';

type Appearance = {
  theme?: 'fat',
  align?: 'right',
  layout?: 'inline',
  resizable?: 'both' | 'horizontal' | 'vertical',
  direction?: 'horizontal',
  colorSchema?: 'dark' | 'transparent',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`), is `true` by default */
  connect?: boolean,
  /** Just render the `<textarea>` element without label */
  elementOnly?: boolean,
  /** Textarea field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Pass a ref to the `<textarea>` element */
  innerRef?: (ref: ?HTMLElement) => void,
  /** Label text */
  label: string | MessageDescriptor,
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
  /** @ignore Will be injected by `asField` */
  formatIntl: (
    text: string | MessageDescriptor,
    textValues?: { [string]: string },
  ) => string,
  /** @ignore Will be injected by `asField` */
  setValue: (val: any) => void,
  /** @ignore Will be injected by `asField` */
  setError: (val: any) => void,
  /** @ignore Standard textarea field property */
  onChange: Function,
};

class Textarea extends Component<Props> {
  static displayName = 'Textarea';

  static defaultProps = {
    appearance: {},
  };

  renderTextarea = inputProps => {
    const { innerRef, ...props } = inputProps;
    return <textarea ref={innerRef} {...props} />;
  };

  render() {
    const {
      appearance = {},
      elementOnly,
      formatIntl,
      help,
      $id,
      label,
      name,
      $value,
      $error,
      $touched,
      setError,
      setValue,
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
        />
        {this.renderTextarea(inputProps)}
      </div>
    );
  }
}

export default asField()(Textarea);
