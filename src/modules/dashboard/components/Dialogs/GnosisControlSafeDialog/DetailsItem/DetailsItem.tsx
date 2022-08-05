import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';
import classnames from 'classnames';

import styles from './DetailsItem.css';

const DetailsItem = ({
  label,
  value,
  isLastItem,
}: {
  label: MessageDescriptor;
  value: JSX.Element;
  isLastItem?: boolean;
}) => {
  return (
    <div
      className={classnames(styles.detailsItem, {
        [styles.separator]: !isLastItem,
      })}
    >
      <div className={styles.detailsItemLabel}>
        <FormattedMessage {...label} />
      </div>
      <div className={styles.detailsItemValue}>{value}</div>
    </div>
  );
};

export default DetailsItem;
