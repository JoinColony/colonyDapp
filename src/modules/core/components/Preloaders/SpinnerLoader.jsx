/* @flow */

import React from 'react';
import { injectIntl } from 'react-intl';

import { getMainClasses } from '~utils/css';

import type { IntlShape, MessageDescriptor } from 'react-intl';

import styles from './SpinnerLoader.css';

type Appearance = {
  size: 'small' | 'medium' | 'large' | 'huge' | 'massive',
  theme?: 'primary',
};

type Props = {
  /** Appearance object */
  appearance?: Appearance,
  /** Text to display while loading */
  loadingText?: MessageDescriptor | string,
  /** Values for loading text (react-intl interpolation) */
  textValues?: { [string]: string },
  /** @ignore injected by `react-intl` */
  intl: IntlShape,
};

const SpinnerLoader = ({
  appearance = { size: 'small' },
  intl: { formatMessage },
  loadingText,
  textValues,
}: Props) => (
  <div className={getMainClasses(appearance, styles)}>
    <div className={styles.loader} />
    {loadingText &&
      (typeof loadingText === 'string'
        ? loadingText
        : formatMessage(loadingText, textValues))}
  </div>
);

export default injectIntl(SpinnerLoader);
