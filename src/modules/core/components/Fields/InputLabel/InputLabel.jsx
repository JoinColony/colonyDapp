/* @flow */

import React from 'react';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import type { Appearance } from '$types/css';
import { getMainClasses } from '$utils/css';

import styles from './InputLabel.css';

const displayName = 'core.InputLabel';

type Props = {
  appearance?: Appearance,
  error?: string,
  help?: string | MessageDescriptor,
  helpValues?: { [string]: string },
  id: string,
  intl: IntlShape,
  label?: string | MessageDescriptor,
  labelValues?: { [string]: string },
}

const InputLabel = ({ appearance, error, help, helpValues, id, intl: { formatMessage }, label: inputLabel, labelValues }: Props) => {
  const helpText = (typeof help == 'object') ? formatMessage(help, helpValues) : help;
  const labelText = (typeof inputLabel == 'object') ? formatMessage(inputLabel, labelValues) : inputLabel;
  return (
    <label
      className={getMainClasses(appearance, styles)}
      id={`${id}_label`}
      htmlFor={id}
    >
      <span className={styles.labelText}>{labelText}</span>
      { error && appearance && appearance.direction !== 'horizontal' ?
        <span className={styles.error}>{error}</span>
        :
        helpText && <span className={styles.help}>({helpText})</span>
      }
    </label>
  );
};

InputLabel.displayName = displayName;

export default InputLabel;
