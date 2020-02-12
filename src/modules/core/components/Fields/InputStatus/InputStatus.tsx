import { MessageDescriptor, useIntl } from 'react-intl';
import React from 'react';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './InputStatus.css';

interface Appearance {
  // Make it covariant: tell flow we're not changing it in here
  readonly theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  readonly direction?: 'horizontal';
  readonly colorSchema?: 'dark' | 'grey' | 'transparent' | 'info';
  readonly size?: 'small';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Error text (if applicable) */
  error?: string | MessageDescriptor;

  /** Status text (if applicable) */
  status?: string | MessageDescriptor;

  /** Values for status text (react-intl interpolation) (if applicable) */
  statusValues?: SimpleMessageValues;
}

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  status,
  statusValues,
}: Props) => {
  const { formatMessage } = useIntl();
  const errorText = typeof error === 'object' ? formatMessage(error) : error;
  const statusText =
    typeof status === 'object' ? formatMessage(status, statusValues) : status;
  const text = errorText || statusText;
  const Element = appearance.direction === 'horizontal' ? 'span' : 'p';
  return (
    <Element
      className={getMainClasses(appearance, styles, {
        error: !!error,
        hidden: !text,
      })}
    >
      {text}
    </Element>
  );
};

InputStatus.displayName = displayName;

export default InputStatus;
