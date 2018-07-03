/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React from 'react';
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

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Input field name (form variable) */
  name: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Label text */
  label: string,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** `errors` object (formik) */
  errors?: Object,
  /** `touched` object (formik) */
  touched?: Object,
  /** `values` object (formik) */
  values?: Object,
  /** `handleChange` function (formik) */
  handleChange?: Function,
  /** `handleBlur` function (formik) */
  handleBlur?: Function,
  /** @ignore Will be injected by `asField` */
  id: string,
  /** @ignore Will be injected by `asField` */
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $touched?: boolean,
};

const displayName = 'Fields.Input';

const Input = ({
  appearance = {},
  elementOnly,
  help,
  id,
  label,
  name,
  $value,
  $error,
  $touched,
  handleChange,
  handleBlur,
  ...props
}: Props) => {
  const inputProps = {
    id,
    name,
    'aria-invalid': $touched && !!$error,
    className: getMainClasses(appearance, styles),
    value: $value,
    onChange: handleChange,
    onBlur: handleBlur,
    ...props,
  };
  if (elementOnly) {
    return <input {...inputProps} aria-label={label} />;
  }
  const containerClasses = cx(styles.container, {
    [styles.containerHorizontal]: appearance.direction === 'horizontal',
  });
  return (
    <div className={containerClasses}>
      <InputLabel
        appearance={appearance}
        inputId={id}
        label={label}
        $error={$error}
        help={help}
      />
      <input {...inputProps} />
      {appearance.direction === 'horizontal' && $error ? (
        <span className={styles.error}>{$error}</span>
      ) : null}
    </div>
  );
};

Input.displayName = displayName;

export default asField(Input);
