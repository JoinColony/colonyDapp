/* @flow */

import React from 'react';

import styles from './Textarea.css';

import type { FieldComponentProps } from '../flowTypes';

import InputLabel from '../InputLabel';

const displayName = 'Fields.Textarea';

type CustomProps = {
  disabled?: boolean,
};

type Props = FieldComponentProps<CustomProps>;

const Textarea = ({ elementOnly,
  error,
  hasError,
  help,
  input,
  inputProps,
  passthroughProps: { disabled, ...props },
  label,
}: Props) => (
  <div
    className={styles.main}
    aria-invalid={hasError}
    aria-disabled={disabled}
  >
    {!elementOnly && label ?
      <InputLabel id={inputProps.id} label={label} error={hasError && error} help={help} />
      :
      null
    }
    <textarea
      {...props}
      {...inputProps}
      {...input}
      className={styles.textarea}
    />
  </div>
);

Textarea.displayName = displayName;

export default Textarea;
