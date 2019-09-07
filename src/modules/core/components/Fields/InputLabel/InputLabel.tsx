import React, { ReactNode } from 'react';
import {
  injectIntl,
  IntlShape,
  MessageDescriptor,
  MessageValues,
} from 'react-intl';
import { getMainClasses } from '~utils/css';

import styles from './InputLabel.css';

const displayName = 'InputLabel';

interface Appearance {
  readonly theme: 'fat' | 'underlined' | 'minimal' | 'dotted';
  readonly direction: 'horizontal';
  readonly colorSchema: 'dark' | 'grey' | 'transparent';
  readonly helpAlign: 'right';
  readonly size: 'small';
}

// Left intentionally unsealed (passing props)
interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Values for help text (react-intl interpolation) */
  helpValues?: MessageValues;

  /** `id` attribute value of accompanied input field */
  inputId?: string;

  /** Label text */
  label: string | MessageDescriptor;

  /** Values for label text (react-intl interpolation) */
  labelValues?: MessageValues;

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

const InputLabel = ({
  appearance = {
    theme: undefined,
    colorSchema: undefined,
    direction: undefined,
    helpAlign: undefined,
    size: undefined,
  },
  help,
  helpValues,
  extra,
  inputId = '',
  intl: { formatMessage },
  label: inputLabel,
  labelValues,
}: Props) => {
  const helpText =
    typeof help === 'object' ? formatMessage(help, helpValues) : help;
  const labelText =
    typeof inputLabel === 'object'
      ? formatMessage(inputLabel, labelValues)
      : inputLabel;
  return (
    <label
      className={getMainClasses(appearance, styles)}
      id={inputId ? `${inputId}-label` : null}
      htmlFor={inputId || null}
    >
      <span className={styles.labelText}>{labelText}</span>
      {helpText && (
        <span className={styles.help}>
          <span className={styles.paren}>(</span>
          {helpText}
          <span className={styles.paren}>)</span>
        </span>
      )}
      {extra && <span className={styles.extra}>{extra}</span>}
    </label>
  );
};

InputLabel.displayName = displayName;

export default injectIntl(InputLabel);
