/* @flow */

import type { Node } from 'react';
import type { IntlShape, MessageDescriptor, MessageValues } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './InputLabel.css';

const displayName = 'InputLabel';

type Appearance = {
  // Make it covariant: tell flow we're not changing it in here
  +theme?: 'fat' | 'underlined' | 'minimal' | 'dotted',
  +direction?: 'horizontal',
  +colorSchema?: 'dark' | 'grey' | 'transparent',
  +size?: 'small',
};

// Left intentionally unsealed (passing props)
type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Extra node to render on the top right in the label */
  extra?: Node,
  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor,
  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues,
  /** `id` attribute value of accompanied input field */
  inputId?: string,
  /** Label text */
  label: string | MessageDescriptor,
  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const InputLabel = ({
  appearance = {},
  help,
  helpValues,
  extra,
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
      {extra && <span className={styles.extra}>{extra}</span>}
    </label>
  );
};

InputLabel.displayName = displayName;

export default injectIntl(InputLabel);
