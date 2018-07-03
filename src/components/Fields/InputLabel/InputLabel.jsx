/* @flow */

import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './InputLabel.css';

const displayName = 'core.Fields.InputLabel';

type Appearance = {
  // eslint-disable-next-line flowtype/space-after-type-colon
  theme?: 'underlined',
  direction?: 'horizontal',
  colorSchema?: 'dark',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Error text (if applicable) */
  error?: string,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** `id` attribute value of accompanied input field */
  inputId?: string,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** @ignore `react-intl` object, so that we have access to the `formatMessage()` method */
  intl: IntlShape,
};

const InputLabel = ({
  appearance,
  error,
  help,
  helpValues,
  inputId = '',
  intl: { formatMessage },
  label: inputLabel,
  labelValues,
}: Props) => {
  const helpText =
    typeof help == 'object' ? formatMessage(help, helpValues) : help;
  const labelText =
    typeof inputLabel == 'object'
      ? formatMessage(inputLabel, labelValues)
      : inputLabel;
  return (
    <label
      className={getMainClasses(appearance, styles)}
      id={inputId ? `${inputId}_label` : null}
      htmlFor={inputId || null}
    >
      <span className={styles.labelText}>{labelText}</span>
      {error && appearance && appearance.direction !== 'horizontal' ? (
        <span className={styles.error}>{error}</span>
      ) : (
        helpText && <span className={styles.help}>({helpText})</span>
      )}
    </label>
  );
};

InputLabel.displayName = displayName;

export default injectIntl(InputLabel);
