import React, { ReactNode } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';
import classNames from 'classnames';

import styles from './StageItem.css';

interface Props {
  label?: string | MessageDescriptor;
  isActive: boolean;
  isFirst?: boolean;
  isCancelled: boolean;
  labelComponent?: ReactNode;
}

const StageItem = ({
  label,
  isActive,
  isFirst,
  isCancelled,
  labelComponent,
}: Props) => {
  const { formatMessage } = useIntl();

  const labelText =
    typeof label === 'object' && label?.id ? formatMessage(label) : label;

  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.dot, {
          [styles.activeDot]: isActive,
          [styles.cancelled]: isCancelled && isActive,
        })}
      />
      {!isFirst && (
        <div
          className={classNames(styles.verticalLine, {
            [styles.verticalLineActive]: isActive,
          })}
        />
      )}
      {!labelComponent ? (
        <div
          className={classNames(styles.label, {
            [styles.activeLabel]: isActive,
            [styles.cancelledLabel]: !isActive && isCancelled,
          })}
        >
          {labelText}
        </div>
      ) : (
        labelComponent
      )}
    </div>
  );
};

export default StageItem;
