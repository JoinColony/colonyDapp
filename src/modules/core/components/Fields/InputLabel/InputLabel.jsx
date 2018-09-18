/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './InputLabel.css';

const displayName = 'InputLabel';

type Appearance = {
  // Make it covariant: tell flow we're not changing it in here
  +theme?: 'fat' | 'underlined' | 'minimal',
  +direction?: 'horizontal',
  +colorSchema?: 'dark' | 'transparent',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: { [string]: string },
  /** Hint (will appear on the top right in the label) */
  hint?: Node,
  /** `id` attribute value of accompanied input field */
  inputId?: string,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: { [string]: string },
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const InputLabel = ({
  appearance = {},
  help,
  helpValues,
  hint,
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
      id={inputId ? `${inputId}-label` : null}
      htmlFor={inputId || null}
    >
      <span className={styles.labelText}>{labelText}</span>
      {helpText && <span className={styles.help}>({helpText})</span>}
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
};

InputLabel.displayName = displayName;

export default injectIntl(InputLabel);
