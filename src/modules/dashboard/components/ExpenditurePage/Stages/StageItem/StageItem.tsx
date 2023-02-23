import React, { ReactNode } from 'react';
import { FormattedMessage, MessageDescriptor, useIntl } from 'react-intl';
import classNames from 'classnames';

import { Appearance } from '../Stages';
import styles from './StageItem.css';

interface Props {
  label?: string | MessageDescriptor;
  isActive: boolean;
  isLast?: boolean;
  isCancelled: boolean;
  labelComponent?: ReactNode;
  description?: MessageDescriptor;
  isActiveLine?: boolean;
  appearance?: Appearance;
  viewFor?: 'incorporation' | 'expenditure';
}
const displayName = 'dashboard.ExpenditurePage.Stages.StageItem';

const StageItem = ({
  label,
  isActive,
  isLast,
  isCancelled,
  labelComponent,
  description,
  isActiveLine,
  appearance,
  viewFor,
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
      {!isLast && (
        <div
          className={classNames(styles.verticalLine, {
            [styles.verticalLineActive]: isActiveLine,
            [styles.shortLine]: viewFor,
          })}
        />
      )}
      <div>
        {!labelComponent ? (
          <div
            className={classNames(styles.label, {
              [styles.activeLabel]: isActive,
              [styles.cancelledLabel]: !isActive && isCancelled,
              [styles.labelMedium]: appearance?.size === 'medium',
            })}
          >
            {labelText}
          </div>
        ) : (
          labelComponent
        )}
        {description && (
          <div className={styles.description}>
            <FormattedMessage {...description} />
          </div>
        )}
      </div>
    </div>
  );
};

StageItem.displayName = displayName;

export default StageItem;
