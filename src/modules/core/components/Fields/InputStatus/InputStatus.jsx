/* @flow */

import type { IntlShape, MessageDescriptor } from 'react-intl';

import React, { Fragment } from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import styles from './InputStatus.css';

type Appearance = {
  // Make it covariant: tell flow we're not changing it in here
  +theme?: 'fat' | 'underlined' | 'minimal' | 'dotted',
  +direction?: 'horizontal',
  +colorSchema?: 'dark' | 'transparent',
  +size?: 'small',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Error text (if applicable) */
  error?: string | MessageDescriptor,
  /** Status text (if applicable) */
  status?: string | MessageDescriptor,
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const displayName = 'InputStatus';

const InputStatus = ({
  appearance = {},
  error,
  intl: { formatMessage },
  status,
}: Props) => {
  const errorText = typeof error == 'object' ? formatMessage(error) : error;
  const statusText = typeof status == 'object' ? formatMessage(status) : status;
  const text = errorText || statusText;
  return (
    <Fragment>
      {appearance.direction === 'horizontal' ? (
        <span
          className={getMainClasses(appearance, styles, {
            error: !!error,
            hidden: !text,
          })}
        >
          {text}
        </span>
      ) : (
        <p
          className={getMainClasses(appearance, styles, {
            error: !!error,
            hidden: !text,
          })}
        >
          {text}
        </p>
      )}
    </Fragment>
  );
};

InputStatus.displayName = displayName;

export default injectIntl(InputStatus);
