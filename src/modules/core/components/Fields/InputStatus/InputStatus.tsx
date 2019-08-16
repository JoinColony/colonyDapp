import { IntlShape, MessageDescriptor, injectIntl } from 'react-intl';
import React from 'react';
import { getMainClasses } from '~utils/css';

import styles from './InputStatus.css';

interface Appearance {
  // Make it covariant: tell flow we're not changing it in here
  readonly theme?: 'fat' | 'underlined' | 'minimal' | 'dotted';
  readonly direction?: 'horizontal';
  readonly colorSchema?: 'dark' | 'grey' | 'transparent';
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
  statusValues?: object;

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  intl: { formatMessage },
  status,
  statusValues,
}: Props) => {
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

export default injectIntl(InputStatus);
