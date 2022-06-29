import React from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './StageItem.css';

interface Props {
  label: string | MessageDescriptor;
  isActive: boolean;
  isFirst?: boolean;
}

const StageItem = ({ label, isActive, isFirst }: Props) => {
  const { formatMessage } = useIntl();

  const labelText =
    typeof label === 'object' && label?.id ? formatMessage(label) : label;

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.dot, { [styles.activeDot]: isActive })}
      />
      {!isFirst && (
        <div
          className={classNames(styles.verticalLine, {
            [styles.verticalLineActive]: isActive,
          })}
        />
      )}
      <div
        className={classNames(styles.label, {
          [styles.activeLabel]: isActive,
        })}
      >
        {labelText}
      </div>
    </div>
  );
};

export default StageItem;
