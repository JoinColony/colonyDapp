/* @flow */

import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';

import Icon from '~core/Icon';

import styles from './TransactionBackToList.css';

const MSG = defineMessages({
  returnToSummary: {
    id: 'users.GasStation.TransactionBackToList.returnToSummary',
    defaultMessage: 'See all pending actions',
  },
});

type Props = {|
  onClose: (event: SyntheticMouseEvent<HTMLButtonElement>) => void,
|};

const displayName = 'users.GasStation.TransactionBackToList';

const TransactionBackToList = ({ onClose }: Props) => (
  <button type="button" className={styles.returnToSummary} onClick={onClose}>
    <Icon
      appearance={{ size: 'small' }}
      name="caret-left"
      title={MSG.returnToSummary}
    />
    <FormattedMessage {...MSG.returnToSummary} />
  </button>
);

TransactionBackToList.displayName = displayName;

export default TransactionBackToList;
