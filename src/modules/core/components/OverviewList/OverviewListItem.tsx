import React, { ReactNode } from 'react';
import { MessageDescriptor, useIntl } from 'react-intl';

import { SimpleMessageValues } from '~types/index';

import styles from './OverviewList.css';

interface Props {
  children: ReactNode;
  title: string | MessageDescriptor;
  description?: string | MessageDescriptor;
  titleValues?: SimpleMessageValues;
  descriptionValues?: SimpleMessageValues;
}

const displayName = 'OverviewList.OverviewListItem';

const OverviewListItem = ({
  title,
  titleValues,
  description,
  descriptionValues,
  children,
}: Props) => {
  const { formatMessage } = useIntl();
  const formattedTitle =
    typeof title === 'string' ? title : formatMessage(title, titleValues);
  let formattedDescription: string;
  if (description) {
    formattedDescription =
      typeof description === 'string'
        ? description
        : formatMessage(description, descriptionValues);
  } else {
    formattedDescription = '';
  }
  return (
    <li className={styles.listItem}>
      <p>
        <span className={styles.listItemTitle}>{formattedTitle}</span>
        <span className={styles.listItemDescription}>
          {formattedDescription}
        </span>
      </p>
      <div className={styles.listItemContent}>{children}</div>
    </li>
  );
};

OverviewListItem.displayName = displayName;

export default OverviewListItem;
