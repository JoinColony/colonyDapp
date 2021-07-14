import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import { getMainClasses } from '~utils/css';

import styles from './SpinnerLoader.css';

export interface Appearance {
  size: 'small' | 'medium' | 'large' | 'huge' | 'massive';
  theme?: 'grey' | 'primary';
  layout?: 'horizontal';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Text to display while loading */
  loadingText?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: SimpleMessageValues;
}

const SpinnerLoader = ({
  appearance = { size: 'small', theme: 'grey' },
  loadingText,
  textValues,
}: Props) => {
  const { formatMessage } = useIntl();
  return (
    <div className={getMainClasses(appearance, styles)}>
      <div className={styles.loader} />
      {loadingText && (
        <div className={styles.loadingTextContainer}>
          <div>
            {typeof loadingText === 'string'
              ? loadingText
              : formatMessage(loadingText, textValues)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpinnerLoader;
