import React from 'react';

import styles from './ActionsList.css';

const displayName = 'Icon';

interface Props {
  /*
   * @TODO This should be an array of Events, Actions or Logs types
   */
  items: any[];
}

const ActionsList = () => <div className={styles.main} />;

ActionsList.displayName = displayName;

export default ActionsList;
