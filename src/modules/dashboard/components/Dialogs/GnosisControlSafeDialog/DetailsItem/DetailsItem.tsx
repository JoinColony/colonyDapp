import React from 'react';
import { FormattedMessage, MessageDescriptor } from 'react-intl';

import styles from './DetailsItem.css';

const DetailsItem = ({
  label,
  value,
}: {
  label: MessageDescriptor;
  value: JSX.Element;
}) => (
  <div className={styles.detailsItem}>
    <div className={styles.detailsItemLabel}>
      <FormattedMessage {...label} />
    </div>
    <div className={styles.detailsItemValue}>{value}</div>
  </div>
);

export default DetailsItem;
