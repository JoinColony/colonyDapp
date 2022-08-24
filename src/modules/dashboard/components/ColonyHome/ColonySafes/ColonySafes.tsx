import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import isEmpty from 'lodash/isEmpty';

import Heading from '~core/Heading';
import { Colony } from '~data/index';

import styles from './ColonySafes.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ColonyHome.ColonySafes.title',
    defaultMessage: 'Linked assets',
  },
});

interface Props {
  colony: Colony;
}

const displayName = 'dashboard.ColonyHome.ColonySafes';

const ColonySafes = ({ colony: { safes } }: Props) => {
  if (isEmpty(safes)) {
    return null;
  }

  return (
    <div className={styles.main}>
      <Heading appearance={{ size: 'normal', weight: 'bold' }}>
        <FormattedMessage {...MSG.title} />
      </Heading>
      <ul>
        {safes.map((safe) => (
          <li
            key={`${safe.chainId}-${safe.contractAddress}`}
            className={styles.safeItem}
          >
            {safe.safeName}
          </li>
        ))}
      </ul>
    </div>
  );
};

ColonySafes.displayName = displayName;

export default ColonySafes;
