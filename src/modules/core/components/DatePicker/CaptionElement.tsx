import React from 'react';
import formatDate from 'sugar-date/date/format';

import styles from './CaptionElement.css';

interface Props {
  date: Date;
}

const CaptionElement = ({ date }: Props) => (
  <div className={styles.main}>
    <div className={styles.monthName}>{formatDate(date, '{Month} {year}')}</div>
  </div>
);

CaptionElement.displayName = 'DatePicker.CaptionElement';

export default CaptionElement;
