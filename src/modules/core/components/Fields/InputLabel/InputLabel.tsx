import React, { ReactNode } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './InputLabel.css';

const displayName = 'InputLabel';

interface Appearance {
  theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  direction?: 'horizontal';
  colorSchema?: 'dark' | 'grey' | 'transparent' | 'info';
  helpAlign?: 'right';
  size?: 'small' | 'medium';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Extra node to render on the top right in the label */
  extra?: ReactNode;

  /** Help text (will appear next to label text) */
  help?: string | MessageDescriptor;

  /** Values for help text (react-intl interpolation) */
  helpValues?: SimpleMessageValues;

  /** `id` attribute value of accompanied input field */
  inputId?: string;

  /** Label text */
  label: string | MessageDescriptor;

  /** Values for label text (react-intl interpolation) */
  labelValues?: SimpleMessageValues;

  /** Should only be visible for screenreaders, but not for display users */
  screenReaderOnly?: boolean;
}

const InputLabel = ({
  appearance,
  help,
  helpValues,
  extra,
  inputId = '',
  label: inputLabel,
  labelValues,
  screenReaderOnly = false,
}: Props) => {
  const { formatMessage } = useIntl();

  const helpText =
    typeof help === 'object' ? formatMessage(help, helpValues) : help;
  const labelText =
    typeof inputLabel === 'object'
      ? formatMessage(inputLabel, labelValues)
      : inputLabel;
  return (
    <label
      className={getMainClasses(appearance, styles, {
        screenReaderOnly,
      })}
      id={inputId ? `${inputId}-label` : undefined}
      htmlFor={inputId || undefined}
    >
      <span className={styles.labelText}>{labelText}</span>
      {helpText && <span className={styles.help}>{helpText}</span>}
      {extra && <span className={styles.extra}>{extra}</span>}
    </label>
  );
};

InputLabel.displayName = displayName;

export default InputLabel;
