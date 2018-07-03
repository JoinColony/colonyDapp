/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React from 'react';
import Cleave from 'cleave.js/react';

import { getMainClasses } from '~utils/css';

import styles from './Input.css';

import asField from '../asField';
import InputLabel from '../InputLabel';

type Props = {
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Input field name (form variable) */
  name: string,
  /** Label text */
  label?: string,
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
  elementOnly,
  name,
  id,
  label,
  $value,
  $error,
  $touched,
  handleChange,
  handleBlur,
  ...props
}: Props) => (
  <div className={styles.container}>
    <InputLabel inputId={id} label={label} />
    <input
      id={id}
      name={name}
      aria-invalid={$touched && !!$error}
      className={styles.main}
      value={$value}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  </div>
);

Input.displayName = displayName;

export default asField(Input);
