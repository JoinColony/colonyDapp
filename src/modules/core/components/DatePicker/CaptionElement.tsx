import React from 'react';
import { FormattedDate } from 'react-intl';

import styles from './CaptionElement.css';

interface Props {
  date: Date;
}

const CaptionElement = ({ date }: Props) => (
  <div className={styles.main}>
    <div className={styles.monthName}>
      <FormattedDate value={date} month="long" year="numeric" />
    </div>
  </div>
);

CaptionElement.displayName = 'DatePicker.CaptionElement';

export default CaptionElement;
