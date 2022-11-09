import React, { useMemo } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';
import styles from './DetailsItem.css';

const DetailsItem = ({
  label,
  textValues,
  value,
}: {
  label: MessageDescriptor;
  textValues?: SimpleMessageValues;
  value: JSX.Element | JSX.Element[];
}) => {
  const { formatMessage } = useIntl();

  const textValue = useMemo(() => {
    if (!label) {
      return '';
    }
    if (typeof label === 'string') {
      return label;
    }
    return formatMessage(label, textValues);
  }, [formatMessage, label, textValues]);

  return (
    <div className={styles.detailsItem}>
      <div className={styles.detailsItemLabel}>{textValue}</div>
      <div className={styles.detailsItemValue}>{value}</div>
    </div>
  );
};

export default DetailsItem;
