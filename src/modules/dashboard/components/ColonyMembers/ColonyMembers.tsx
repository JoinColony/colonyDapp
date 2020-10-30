import React from 'react';
import { defineMessages } from 'react-intl';

import styles from './ColonyMembers.css';

const MSG = defineMessages({
  text: {
    id: 'dashboard.ColonyMembers.text',
    defaultMessage: 'Text',
  },
});

interface Props {}

const displayName = 'dashboard.ColonyMembers';

const ColonyMembers = () => {
  return <div className={styles.main} />;
};

ColonyMembers.displayName = displayName;

export default ColonyMembers;
