/* @flow */

import type { IntlShape, MessageDescriptor } from 'react-intl';

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './InputStatus.css';

type Appearance = {
  // Make it covariant: tell flow we're not changing it in here
  +theme?: 'fat' | 'underlined' | 'minimal' | 'dotted',
  +direction?: 'horizontal',
  +colorSchema?: 'dark' | 'grey' | 'transparent',
  +size?: 'small',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Error text (if applicable) */
  error?: string | MessageDescriptor,
  /** Status text (if applicable) */
  status?: string | MessageDescriptor,
  /** Values for status text (react-intl interpolation) (if applicable) */
  statusValues?: Object,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  intl: { formatMessage },
  status,
  statusValues,
}: Props) => {
  const errorText = typeof error == 'object' ? formatMessage(error) : error;
  const statusText =
    typeof status == 'object' ? formatMessage(status, statusValues) : status;
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
