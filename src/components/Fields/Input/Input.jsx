/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React from 'react';
import Cleave from 'cleave.js/react';

import { getMainClasses } from '~utils/css';

import styles from './Input.css';

import asField from '../asField';

type Props = {
  /** Just render the `<input>` element without label */
  elementOnly?: boolean,
  /** Input field name (form variable) */
  name: string,
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
  $error?: string,
  /** @ignore Will be injected by `asField` */
  $value?: string,
  /** @ignore Will be injected by `asField` */
  $isTouched?: boolean,
};

const Input = ({
  elementOnly,
  name,
  $value,
  $error,
  $isTouched,
  handleChange,
  handleBlur,
  ...props
}: Props) => (
  <input
    name={name}
    aria-invalid={$isTouched && !!$error}
    className={styles.main}
    id={name}
    value={$value}
    onChange={handleChange}
    onBlur={handleBlur}
    {...props}
  />
);

export default asField(Input);
