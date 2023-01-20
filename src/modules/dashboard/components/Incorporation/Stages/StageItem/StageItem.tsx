import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classNames from 'classnames';

import styles from './StageItem.css';

interface Props {
  title?: MessageDescriptor;
  description?: MessageDescriptor;
  isActive: boolean;
  isLast?: boolean;
}
const displayName = 'dashboard.Incorporation.Stages.StageItem';

const StageItem = ({ title, description, isActive, isLast }: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={classNames(styles.dot, {
          [styles.activeDot]: isActive,
        })}
      />
      {!isLast && <div className={styles.verticalLine} />}
      <div>
        <div
          className={classNames(styles.label, {
            [styles.completedLabel]: isActive,
          })}
        >
          <FormattedMessage {...title} />
        </div>
        <div className={styles.description}>
          <FormattedMessage {...description} />
        </div>
      </div>
    </div>
  );
};

StageItem.displayName = displayName;

export default StageItem;
