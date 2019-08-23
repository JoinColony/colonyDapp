import React from 'react';
import {
  injectIntl,
  IntlShape,
  MessageDescriptor,
  MessageValues,
} from 'react-intl';

import { getMainClasses } from '~utils/css';
import styles from './SpinnerLoader.css';

interface Appearance {
  size: 'small' | 'medium' | 'large' | 'huge' | 'massive';
  theme?: 'primary';
}

interface Props {
  /** Appearance object */
  appearance?: Appearance;

  /** Text to display while loading */
  loadingText?: MessageDescriptor | string;

  /** Values for loading text (react-intl interpolation) */
  textValues?: MessageValues;

  /** @ignore injected by `react-intl` */
  intl: IntlShape;
}

const SpinnerLoader = ({
  appearance = { size: 'small' },
  intl: { formatMessage },
  loadingText,
  textValues,
}: Props) => (
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

export default injectIntl(SpinnerLoader);
