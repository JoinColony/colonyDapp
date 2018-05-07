/* @flow */

import React from 'react';

import { getMainClasses } from '~utils/css';

import type { IntlShape, MessageDescriptor } from 'react-intl';
import type { Appearance } from '~types/css';

import styles from './SpinnerLoader.css';

type Props = {
  appearance?: Appearance,
  className?: string,
  intl: IntlShape,
  loadingText?: MessageDescriptor | string,
  textValues?: { [string]: string },
};

const SpinnerLoader = ({
  appearance,
  intl,
  loadingText,
  textValues,
  className,
}: Props) => {
  const size = (appearance && appearance.size) || 'small';
  return (
    <div className={className || getMainClasses(appearance, styles)}>
      <div className={styles[size]} />
      {loadingText &&
        (typeof loadingText === 'string'
          ? loadingText
          : intl.formatMessage(loadingText, textValues))}
    </div>
  );
};

export default SpinnerLoader;
