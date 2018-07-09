/* @flow */

import type { MessageDescriptor } from 'react-intl';
import React from 'react';
// import Cleave from 'cleave.js/react';
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
  /** Connect to form state (will inject `$value`, `$id`, `$error`, `$touched`) */
  connect?: boolean,
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
  /** @ignore Will be injected by `asField` */
  $id: string,
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
  /* eslint-disable-next-line no-unused-vars */
  connect = true,
  elementOnly,
  help,
  $id,
  label,
  name,
  $value,
  $error,
  $touched,
  ...props
}: Props) => {
  const inputProps = {
    id: $id,
    name,
    'aria-invalid': $touched && !!$error,
    className: getMainClasses(appearance, styles),
    value: $value,
    ...props,
  };
  if (elementOnly) {
    return <input {...inputProps} />;
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
      <input {...inputProps} />
      {appearance.direction === 'horizontal' && $error ? (
        <span className={styles.error}>{$error}</span>
      ) : null}
    </div>
  );
};

Input.displayName = displayName;

export default asField(Input);
